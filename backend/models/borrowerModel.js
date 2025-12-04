import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    
    phone: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", borrowerSchema);
export default Borrower;