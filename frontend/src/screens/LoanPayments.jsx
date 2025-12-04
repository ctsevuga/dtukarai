// components/LoanPayments.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useGetPaymentsByLoanQuery } from "../slices/paymentsApiSlice"; // adjust path
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const LoanPayments = () => {
  const { loanId } = useParams();
  const { data, isLoading, isError, error } = useGetPaymentsByLoanQuery(loanId);
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" variant="h6" align="center" mt={5}>
        {error?.data?.message || "Failed to load payments."}
      </Typography>
    );
  }

  const { loan, payments } = data;

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{ maxWidth: 600, margin: "0 auto" }}
    >
      {/* Loan Summary */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderLeft: `6px solid ${theme.palette.primary.main}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Loan Summary
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountBalanceIcon />
            <Typography>Principal: ₹{loan.principalAmount}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PaidIcon />
            <Typography>Amount Paid to Borrower: ₹{loan.amountPaidToBorrower}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TrendingUpIcon />
            <Typography>Amount Paid by Borrower: ₹{loan.amountPaidByBorrower}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <MonetizationOnIcon />
            <Typography>Remaining Amount: ₹{loan.remainingAmount}</Typography>
          </Stack>
          <Typography>Status: {loan.status.toUpperCase()}</Typography>
        </Stack>
      </Paper>

      {/* Payments */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
        Payments
      </Typography>

      {payments.length === 0 && (
        <Typography align="center" color="text.secondary">
          No payments found for this loan.
        </Typography>
      )}

      {payments.map((payment) => (
        <Paper
          key={payment._id}
          elevation={3}
          sx={{
            p: 2,
            borderLeft: `6px solid ${theme.palette.secondary.main}`,
            background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "#fff",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Avatar sx={{ bgcolor: theme.palette.primary.dark }}>
              <MonetizationOnIcon />
            </Avatar>
            <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
              ₹{payment.amountPaid}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.3)" }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon />
              <Typography>{payment.borrower?.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon />
              <Typography>{new Date(payment.paymentDate).toLocaleDateString()}</Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default LoanPayments;
