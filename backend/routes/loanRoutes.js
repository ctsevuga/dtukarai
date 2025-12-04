import express from "express";
import {
  createLoan,
  getAllLoans,
  getLoanById,
  getLoansByAgent,
  addPayment,
  updateLoanStatusManually,
  deleteLoan,
} from "../controllers/loanController.js";

import { protect, admin, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/loans
 * @route GET  /api/loans
 * Admin only
 */
router
  .route("/")
  .post(protect, authorizeRoles("admin"), createLoan);
  
  router
  .route("/")
  .get(protect,  getAllLoans);

/**
 * @route GET /api/loans/:id
 * Admin + Agent
 */
router.get(
  "/:id",
  protect,
  getLoanById
);

/**
 * @route GET /api/loans/agent/:agentId
 * Admin + Agent
 */
router.get(
  "/agent/:agentId",
  protect,
  
  getLoansByAgent
);

/**
 * @route POST /api/loans/:id/pay
 * Agents only
 */
router.post(
  "/:id/pay",
  protect,
  
  addPayment
);

/**
 * @route PUT /api/loans/:id/status
 * Admin only
 */
router.put(
  "/:id/status",
  protect,
  
  updateLoanStatusManually
);

/**
 * @route DELETE /api/loans/:id
 * Admin only
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteLoan
);

export default router;
