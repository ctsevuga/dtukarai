import Payment from "../models/paymentModel.js";
import Loan from "../models/loanModel.js";
import User from "../models/userModel.js";
import Borrower from "../models/borrowerModel.js";
import moment from "moment-timezone";
import mongoose from "mongoose";

/**
 * @desc Add payment for a loan
 * @route POST /api/payments
 * @access Agent
 */
const addPayment = async (req, res) => {
  try {
    const { loanId, borrower, agent, amountPaid } = req.body;

    // Validate Loan
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Validate Borrower (use Borrower model, not User)
    const borrowerExists = await Borrower.findById(borrower);
    if (!borrowerExists)
      return res.status(404).json({ message: "Borrower not found" });

    // Validate Agent (User model)
    const agentExists = await User.findById(agent);
    if (!agentExists)
      return res.status(404).json({ message: "Agent not found" });

    // Create Payment Record
    const payment = await Payment.create({
      loanId,
      borrower,
      agent,
      amountPaid
    });

    // Update Loan repayment stats
    loan.amountPaidByBorrower += amountPaid;
    loan.remainingAmount -= amountPaid;

    if (loan.remainingAmount <= 0) {
      loan.remainingAmount = 0;
      loan.status = "completed";
    }

    await loan.save();

    res.status(201).json({
      message: "Payment added successfully",
      payment,
      updatedLoan: loan
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all payments (admin)
 * @route GET /api/payments
 * @access Admin
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("loanId", "principalAmount remainingAmount status")
      .populate("borrower", "name phone") // borrower updated
      .populate("agent", "name email");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get payments for a loan
 * @route GET /api/payments/loan/:loanId
 * @access Admin / Agent
 */
const getTodaysPayments = async (req, res) => {
  try {
    // Get today's date in IST timezone
    const raw = await Payment.find().lean();
console.log(JSON.stringify(raw[0], null, 2));
    const todayStart = moment().tz('Asia/Kolkata').startOf('day').toDate();
    const todayEnd = moment().tz('Asia/Kolkata').endOf('day').toDate();

    // Fetch payments made today
    const payments = await Payment.find({
      paymentDate: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("loanId", "principalAmount remainingAmount status")
      .populate("borrower", "name phone") 
      .populate("agent", "name email");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getYesterdaysPayments = async (req, res) => {
  try {
    // Get the start and end of yesterday in IST timezone
    const yesterdayStart = moment().tz('Asia/Kolkata').subtract(1, 'days').startOf('day').toDate();
    const yesterdayEnd = moment().tz('Asia/Kolkata').subtract(1, 'days').endOf('day').toDate();

    // Fetch payments made yesterday
    const payments = await Payment.find({
      paymentDate: { $gte: yesterdayStart, $lte: yesterdayEnd },
    })
      .populate("loanId", "principalAmount remainingAmount status")
      .populate("borrower", "name phone") 
      .populate("agent", "name email");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPaymentsByLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Invalid loan ID" });
    }

    const loan = await Loan.findById(loanId).lean();
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const payments = await Payment.find({ loanId })
      .sort({ paymentDate: -1 })
      .populate("borrower", "name phone")
      .populate("agent", "name email")
      .lean();

    res.status(200).json({ loan, payments }); // send both
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPaymentReport = async (req, res) => {
  try {
    const { borrowerId, loanId, startDate, endDate, agentId } = req.query;

    // Build filter object
    let filter = {};
    if (borrowerId) filter.borrower = borrowerId;
    if (loanId) filter.loanId = loanId;
    if (agentId) filter.agent = agentId;

    // Payment Date Range Filter
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    // Query payments
    const payments = await Payment.find(filter)
      .populate({
        path: "borrower",
        select: "name phone isActive",
      })
      .populate({
        path: "loanId",
        select:
          "principalAmount interestRate initialInterestDeduction installmentAmount amountPaidToBorrower amountPaidByBorrower remainingAmount startDate status",
      })
      .populate({
        path: "agent",
        select: "name email",
      })
      .sort({ paymentDate: -1 }); // newest first

    // Summary totals
    const totalAmountPaid = payments.reduce(
      (sum, payment) => sum + payment.amountPaid,
      0
    );

    // Total amount paid to borrower across all loans in report
    const totalAmountPaidToBorrower = payments.reduce(
      (sum, payment) => sum + (payment.loanId?.amountPaidToBorrower || 0),
      0
    );

    // NEW: Total Principal Amount
    const totalPrincipalAmount = payments.reduce(
      (sum, payment) => sum + (payment.loanId?.principalAmount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      totalPayments: payments.length,
      totalAmountPaid,
      totalAmountPaidToBorrower,
      totalPrincipalAmount, // <-- NEW FIELD
      data: payments,
    });
  } catch (error) {
    console.error("Payment Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Unable to generate report.",
    });
  }
};






/**
 * @desc Get payments made by a borrower
 * @route GET /api/payments/borrower/:borrowerId
 * @access Admin / Agent
 */
const getPaymentsByBorrower = async (req, res) => {
  try {
    const payments = await Payment.find({ borrower: req.params.borrowerId })
      .populate("loanId", "principalAmount status")
      .populate("agent", "name email")
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete a payment (rollback loan amounts)
 * @route DELETE /api/payments/:id
 * @access Admin
 */
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    const loan = await Loan.findById(payment.loanId);

    // Rollback loan balances
    loan.amountPaidByBorrower -= payment.amountPaid;
    loan.remainingAmount += payment.amountPaid;

    // Restore status if not completed anymore
    if (loan.remainingAmount > 0) {
      loan.status = "active";
    }

    await loan.save();
    await payment.remove();

    res.status(200).json({
      message: "Payment deleted successfully and loan updated",
      updatedLoan: loan
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  addPayment,
  getAllPayments,
  getPaymentsByLoan,
  getPaymentsByBorrower,
  deletePayment,
  getPaymentReport,
  getTodaysPayments,
  getYesterdaysPayments,
};
