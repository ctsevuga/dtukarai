import Loan from "../models/loanModel.js";
import User from "../models/userModel.js";
import Borrower from "../models/borrowerModel.js";

// Helper: Update loan status after a payment
const updateLoanStatus = async (loan) => {
  if (loan.remainingAmount <= 0) {
    loan.status = "completed";
    loan.remainingAmount = 0;
  }
  await loan.save();
};

/**
 * @desc Create a new loan
 * @route POST /api/loans
 * @access Admin
 */
const createLoan = async (req, res) => {
  try {
    const {
      newBorrower,        // Boolean
      borrower,           // borrowerId OR { name, phone }
      assignedAgent,
      principalAmount,
      amountPaidToBorrower,
      installmentCount,
      startDate
    } = req.body;

    let borrowerId;

    // ----------------------------------------------------------
    // 1️⃣ If creating a NEW borrower
    // ----------------------------------------------------------
    if (newBorrower) {
      if (!borrower?.name || !borrower?.phone) {
        return res.status(400).json({
          message: "Borrower name and phone are required for new borrower",
        });
      }

      // Check phone duplication
      const phoneExists = await Borrower.findOne({ phone: borrower.phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number already registered" });
      }

      // Create borrower
      const newBorrowerRecord = await Borrower.create({
        name: borrower.name,
        phone: borrower.phone,
      });

      borrowerId = newBorrowerRecord._id;
    } 
    else {
      // ----------------------------------------------------------
      // 2️⃣ Using existing borrower
      // ----------------------------------------------------------
      const borrowerExists = await Borrower.findById(borrower);
      if (!borrowerExists) {
        return res.status(400).json({ message: "Borrower not found" });
      }

      borrowerId = borrower;
    }

    // ----------------------------------------------------------
    // 3️⃣ New Calculation (no interestRate)
    // ----------------------------------------------------------
    if (!amountPaidToBorrower) {
      return res.status(400).json({
        message: "amountPaidToBorrower is required",
      });
    }

    const initialInterestDeduction =
      Number(principalAmount) - Number(amountPaidToBorrower);

    if (initialInterestDeduction < 0) {
      return res.status(400).json({
        message: "Amount paid cannot exceed principal amount",
      });
    }

    // Default installment count if none provided
    const finalInstallmentCount = installmentCount || 100;

    // Optional: keep installmentAmount (let me know if you want to remove it)
    const installmentAmount = Number(principalAmount) / finalInstallmentCount;

    const remainingAmount = Number(principalAmount);

    // ----------------------------------------------------------
    // 4️⃣ Create Loan Record
    // ----------------------------------------------------------
    const loan = await Loan.create({
      borrower: borrowerId,
      assignedAgent,
      principalAmount,
      amountPaidToBorrower,
      initialInterestDeduction,
      installmentCount: finalInstallmentCount,
      installmentAmount,          // OPTIONAL — tell me if you want to remove it completely
      remainingAmount,
      amountPaidByBorrower: 0,
      startDate,
    });

    res.status(201).json({
      message: newBorrower
        ? "New borrower created and loan created successfully"
        : "Loan created successfully",
      loan,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};



/**
 * @desc Get all loans (admin)
 * @route GET /api/loans
 * @access Admin
 */
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("borrower", "name phone") // borrower has only name & phone
      .populate("assignedAgent", "name email");

    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const createLoanInProgress = async (req, res) => {
  try {
    const {
      newBorrower,       // true or false
      borrower,          // if newBorrower = true → borrower = { name, phone }
                         // if newBorrower = false → borrower = borrowerId
      assignedAgent,
      principalAmount,
      installmentCount,
      amountPaidToBorrower,
      amountPaidByBorrower,
      startDate
    } = req.body;

    let borrowerId;
    
    // -----------------------------
    // 1️⃣ Handle New Borrower
    // -----------------------------
    if (newBorrower) {
      // Validate new borrower data
      if (!borrower?.name || !borrower?.phone) {
        return res.status(400).json({
          message: "Borrower name and phone are required for new borrower",
        });
      }

      // Check for duplicate phone
      const phoneExists = await Borrower.findOne({ phone: borrower.phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number already registered" });
      }

      // Create new borrower
      const newBorrowerRecord = await Borrower.create({
        name: borrower.name,
        phone: borrower.phone,
      });

      borrowerId = newBorrowerRecord._id;
    } else {
      // Existing borrower
      const borrowerExists = await Borrower.findById(borrower);
      if (!borrowerExists) {
        return res.status(400).json({ message: "Borrower not found" });
      }
      borrowerId = borrower;
    }

    // -----------------------------
    // 2️⃣ Validate required fields
    // -----------------------------
    if (
      !principalAmount ||
      !amountPaidToBorrower ||
      !installmentCount ||
      amountPaidByBorrower === undefined ||
      !startDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // -----------------------------
    // 3️⃣ Loan Calculations
    // -----------------------------
    const initialInterestDeduction = principalAmount - amountPaidToBorrower;
    const installmentAmount = principalAmount / installmentCount;
    const remainingAmount = principalAmount - amountPaidByBorrower;

    // -----------------------------
    // 4️⃣ Create Loan
    // -----------------------------
    const loan = await Loan.create({
      borrower: borrowerId,
      assignedAgent: assignedAgent || null,
      principalAmount,
      initialInterestDeduction,
      amountPaidToBorrower,
      installmentCount,
      installmentAmount,
      amountPaidByBorrower,
      remainingAmount,
      startDate,
      status: remainingAmount <= 0 ? "completed" : "active",
    });

    res.status(201).json({
      message: newBorrower
        ? "New borrower created and loan created successfully"
        : "Loan created successfully",
      loan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



/**
 * @desc Get a single loan
 * @route GET /api/loans/:id
 * @access Admin / Agent
 */
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate("borrower", "name phone")
      .populate("assignedAgent", "name email");

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Get loans assigned to an agent
 * @route GET /api/loans/agent/:agentId
 * @access Agent / Admin
 */
const getLoansByAgent = async (req, res) => {
  try {
    const loans = await Loan.find({ assignedAgent: req.params.agentId })
      .populate("borrower", "name phone");

    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Add a payment by borrower
 * @route POST /api/loans/:id/pay
 * @access Agent
 */
const addPayment = async (req, res) => {
  try {
    const { amountPaid } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.amountPaidByBorrower += amountPaid;
    loan.remainingAmount -= amountPaid;

    await updateLoanStatus(loan);

    res.status(200).json({
      message: "Payment added successfully",
      loan
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Update loan status manually
 * @route PUT /api/loans/:id/status
 * @access Admin
 */
const updateLoanStatusManually = async (req, res) => {
  try {
    const { status } = req.body;

    const loan = await Loan.findById(req.params.id);

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.status = status;
    await loan.save();

    res.status(200).json({ message: "Loan status updated", loan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc Delete a loan
 * @route DELETE /api/loans/:id
 * @access Admin
 */
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    await loan.remove();

    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export {
  createLoan,
  getAllLoans,
  getLoanById,
  getLoansByAgent,
  addPayment,
  updateLoanStatusManually,
  createLoanInProgress,
  deleteLoan,
};
