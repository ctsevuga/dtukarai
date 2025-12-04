
// models/Payment.js
import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const PaymentSchema = new mongoose.Schema(
  {
    loanId: {
      type: ObjectId,
      ref: "Loan",
      required: true
    },

    borrower: {
      type: ObjectId,
      ref: "Borrower",
      required: true
    },

    agent: {
      type: ObjectId,
      ref: "User",
      required: true
    },

    amountPaid: {
      type: Number,
      required: true
    },

    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;

