import express from "express";
import {
  addPayment,
  getAllPayments,
  getPaymentsByLoan,
  getPaymentsByBorrower,
  deletePayment,
  getPaymentReport,
} from "../controllers/paymentController.js";

import { protect, admin, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/payments
 * Add payment - Agent only
 * @route GET /api/payments
 * Get all payments - Admin only
 */
router.get("/payment-report", getPaymentReport);
router
  .route("/")
  .post(protect,  addPayment)
  .get(protect,  getAllPayments);

/**
 * @route GET /api/payments/loan/:loanId
 * Admin + Agent
 */
router.get(
  "/loan/:loanId",
  protect,
  
  getPaymentsByLoan
);

/**
 * @route GET /api/payments/borrower/:borrowerId
 * Admin + Agent
 */
router.get(
  "/borrower/:borrowerId",
  protect,
  
  getPaymentsByBorrower
);

/**
 * @route DELETE /api/payments/:id
 * Admin only
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePayment
);

export default router;
