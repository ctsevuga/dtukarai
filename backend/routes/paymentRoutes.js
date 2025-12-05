import express from "express";
import {
  addPayment,
  getAllPayments,
  getPaymentsByLoan,
  getPaymentsByBorrower,
  deletePayment,
  getPaymentReport,
  getTodaysPayments,
  getYesterdaysPayments
} from "../controllers/paymentController.js";

import { protect, admin, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/payments/payment-report
 */
router.get("/payment-report", getPaymentReport);

/**
 * @route POST /api/payments
 * @route GET /api/payments
 */
router
  .route("/")
  .post(protect, addPayment)
  .get(protect, getAllPayments);

/**
 * @route GET /api/payments/today
 * Fetch today's payments (IST)
 */
router.get(
  "/today",
  protect,
  getTodaysPayments
);

/**
 * @route GET /api/payments/yesterday
 * Fetch yesterday's payments (IST)
 */
router.get(
  "/yesterday",
  protect,
  getYesterdaysPayments
);

/**
 * @route GET /api/payments/loan/:loanId
 */
router.get(
  "/loan/:loanId",
  protect,
  getPaymentsByLoan
);

/**
 * @route GET /api/payments/borrower/:borrowerId
 */
router.get(
  "/borrower/:borrowerId",
  protect,
  getPaymentsByBorrower
);

/**
 * @route DELETE /api/payments/:id
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePayment
);

export default router;
