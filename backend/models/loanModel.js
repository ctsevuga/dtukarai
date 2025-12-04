// models/Loan.js
import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const LoanSchema = new mongoose.Schema(
  {
    borrower: {
      type: ObjectId,
      ref: "Borrower",
      required: true
    },

    assignedAgent: {
      type: ObjectId,
      ref: "User",
      required: false
    },

    principalAmount: { type: Number, required: true },

    interestRate: { type: Number }, // % or flat, your logic

    initialInterestDeduction: { type: Number, required: true },

    amountPaidToBorrower: { type: Number, required: true }, 
    // principal - interestDeduction

    installmentCount: { type: Number, default: 100 },

    installmentAmount: { type: Number, required: true },

    amountPaidByBorrower: { type: Number, default: 0 },

    remainingAmount: { type: Number, required: true },

    startDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["active", "completed", "overdue"],
      default: "active"
    }
  },
  { timestamps: true }
);
const Loan = mongoose.model("Loan", LoanSchema);
export default Loan;




