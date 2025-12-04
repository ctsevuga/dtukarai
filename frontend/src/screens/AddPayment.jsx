import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useAddPaymentMutation } from "../slices/paymentsApiSlice";
import { useGetLoanByIdQuery } from "../slices/loansApiSlice";

const AddPayment = () => {
  const { id } = useParams(); // loan ID from route
  const navigate = useNavigate();
  const { data: loan, isLoading: loanLoading, error: loanError } = useGetLoanByIdQuery(id);

  const [amountPaid, setAmountPaid] = useState("");
  const [addPayment, { isLoading, error, isSuccess }] = useAddPaymentMutation();

  // Set default amountPaid to installmentAmount once loan data is loaded
  useEffect(() => {
    if (loan?.installmentAmount) {
      setAmountPaid(Math.round(loan.installmentAmount));
    }
  }, [loan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amountPaid || amountPaid <= 0) return;

    try {
      await addPayment({
        loanId: id,
        borrower: loan.borrower._id,
        agent: loan.assignedAgent?._id || loan.borrower._id, // fallback to borrower if no agent
        amountPaid: Number(amountPaid),
      }).unwrap();
      setAmountPaid(Math.round(loan.installmentAmount)); // reset after success
 // reset to installmentAmount after successful payment
    } catch (err) {
      console.error(err);
    }
  };

  if (loanLoading)
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading loan details...
      </Typography>
    );

  if (loanError)
    return (
      <Typography align="center" mt={5} color="error">
        Failed to load loan
      </Typography>
    );

  return (
    <Box sx={{ p: 2, maxWidth: 500, mx: "auto" }}>
      <Card
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #43cea2, #185a9d)",
          color: "white",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <PaymentsIcon sx={{ mr: 1 }} /> Add Payment
          </Typography>

          {/* Loan Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1 }}>
              <strong>Borrower:</strong> {loan.borrower?.name}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Loan Amount:</strong> ₹{loan.principalAmount}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Remaining Amount:</strong> ₹{loan.remainingAmount}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Status:</strong> {loan.status.toUpperCase()}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Installment Amount:</strong> ₹{loan.installmentAmount}
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Amount Paid"
              type="number"
              fullWidth
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
              InputProps={{ inputProps: { min: 0 } }}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={isLoading}
                >
                  Add Payment
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>

            {isSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Payment added successfully!
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error?.data?.message || "Failed to add payment"}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddPayment;
