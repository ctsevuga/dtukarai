import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import { useParams } from "react-router-dom";
import {
  useGetLoanByIdQuery,
  useAddPaymentToLoanMutation,
} from "../slices/loansApiSlice";

import PaidIcon from "@mui/icons-material/Paid";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { toast } from "react-toastify";

const LoanAddPayment = () => {
  const { id } = useParams();

  const { data: loan, isLoading } = useGetLoanByIdQuery(id);
  const [addPaymentToLoan, { isLoading: updating }] =
    useAddPaymentToLoanMutation();

  const [amountPaid, setAmountPaid] = useState("");

  const handleSubmit = async () => {
    if (!amountPaid || amountPaid <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addPaymentToLoan({ id, amountPaid: Number(amountPaid) }).unwrap();
      toast.success("Payment added successfully!");
      setAmountPaid("");
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed");
    }
  };

  if (isLoading)
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading loan details…
      </Typography>
    );

  if (!loan)
    return (
      <Typography align="center" mt={5} color="error">
        Loan not found.
      </Typography>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Card
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #ff6e40, #ff3d00)",
          color: "white",
          p: 2,
          boxShadow: "0px 6px 16px rgba(0,0,0,0.4)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            Add Loan Payment
          </Typography>

          {/* Status Chip */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Chip
              label={loan.status.toUpperCase()}
              color={
                loan.status === "active"
                  ? "warning"
                  : loan.status === "completed"
                  ? "success"
                  : "error"
              }
              sx={{ fontWeight: "bold", fontSize: 15 }}
            />
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", mb: 2 }} />

          {/* Amount Information */}
          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            Total Paid: <strong>&nbsp;₹{loan.amountPaidByBorrower}</strong>
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PaidIcon sx={{ mr: 1 }} />
            Remaining: <strong>&nbsp;₹{loan.remainingAmount}</strong>
          </Typography>

          {/* Input Field */}
          <TextField
            fullWidth
            type="number"
            label="Enter Payment Amount"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            sx={{
              background: "white",
              borderRadius: 2,
              mb: 3,
            }}
            InputProps={{
              style: { fontWeight: "bold" },
            }}
          />

          {/* Submit Payment Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={updating}
            startIcon={<PaymentsIcon />}
            sx={{
              py: 1.5,
              fontSize: 16,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
              "&:hover": {
                background: "linear-gradient(135deg, #388e3c, #2e7d32)",
              },
              boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            {updating ? "Processing..." : "Add Payment"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoanAddPayment;
