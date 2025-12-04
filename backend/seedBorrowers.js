import mongoose from "mongoose";
import dotenv from "dotenv";
import Loan from "./models/loanModel.js"; // adjust path if needed

dotenv.config();

// Borrowers and Agent IDs
const borrowerIds = [
  "69304939cf8955b45da40dca",
  "69304939cf8955b45da40dcb",
  "69304939cf8955b45da40dcc",
  "69304939cf8955b45da40dcd",
  "69304939cf8955b45da40dce",
];

const assignedAgentId = "693048f20d637b29087d9402";

// Helper function to generate random number in range
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Seed Data Generator
const generateLoanData = () => {
  const principalAmount = getRandomNumber(5000, 50000);
  const interestRate = getRandomNumber(5, 15); // 5% - 15%
  const installmentCount = getRandomNumber(5, 20);
  const initialInterestDeduction = (principalAmount * interestRate) / 100;
  const amountPaidToBorrower = principalAmount - initialInterestDeduction;
  const installmentAmount = principalAmount / installmentCount;
  const remainingAmount = principalAmount;

  const randomBorrower =
    borrowerIds[Math.floor(Math.random() * borrowerIds.length)];

  // Random start date within last 60 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - getRandomNumber(0, 60));

  return {
    borrower: randomBorrower,
    assignedAgent: assignedAgentId,
    principalAmount,
    interestRate,
    initialInterestDeduction,
    amountPaidToBorrower,
    installmentCount,
    installmentAmount,
    amountPaidByBorrower: 0,
    remainingAmount,
    startDate,
    status: "active",
  };
};

const seedLoans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    // Delete existing loans
    await Loan.deleteMany();
    console.log("🗑️ Existing loans deleted");

    // Generate 20 loans
    const loans = Array.from({ length: 20 }, generateLoanData);

    await Loan.insertMany(loans);
    console.log("🌱 20 Loans seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Loan seeding failed:", error);
    process.exit(1);
  }
};

seedLoans();
