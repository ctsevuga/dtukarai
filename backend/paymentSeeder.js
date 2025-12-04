import mongoose from "mongoose";
import dotenv from "dotenv";
import Payment from "./models/paymentModel.js";
import Loan from "./models/loanModel.js";

dotenv.config();

const assignedAgentId = "693048f20d637b29087d9402";

const seedPayments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Delete existing payments
    await Payment.deleteMany();
    console.log("Deleted existing payments");

    // Fetch current loans
    const loans = await Loan.find();
    if (loans.length === 0) {
      console.log("No loans found, seed loans first!");
      process.exit();
    }

    // Seed payments
    const payments = loans.map((loan) => ({
      loanId: loan._id,
      borrower: loan.borrower,
      agent: assignedAgentId,
      amountPaid: Math.floor(Math.random() * 10000) + 500, // random payment
      paymentDate: new Date(),
    }));

    await Payment.insertMany(payments);
    console.log("Payments seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Payment seeding failed:", error);
    process.exit(1);
  }
};

seedPayments();
