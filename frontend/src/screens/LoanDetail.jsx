import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Grid,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useGetLoanByIdQuery } from "../slices/loansApiSlice";

import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import PaidIcon from "@mui/icons-material/Paid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const LoanDetail = () => {
  const { id } = useParams();
  const { data: loan, isLoading, error } = useGetLoanByIdQuery(id);

  if (isLoading)
    return (
      <Typography mt={5} align="center" variant="h6">
        Loading loan details...
      </Typography>
    );

  if (error)
    return (
      <Typography mt={5} align="center" color="error">
        Failed to load loan.
      </Typography>
    );

  if (!loan)
    return (
      <Typography mt={5} align="center" color="error">
        Loan not found.
      </Typography>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Card
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #673ab7, #512da8)",
          color: "white",
          boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            sx={{ mb: 2, textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
          >
            Loan Details
          </Typography>

          {/* STATUS */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Chip
              label={loan.status.toUpperCase()}
              color={
                loan.status === "active"
                  ? "success"
                  : loan.status === "completed"
                  ? "primary"
                  : "error"
              }
              size="medium"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          {/* Borrower Section */}
          <Typography
            variant="h6"
            sx={{ mt: 2, display: "flex", alignItems: "center" }}
          >
            <PersonIcon sx={{ mr: 1 }} /> Borrower
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.4)", mb: 1 }} />

          <Typography>Name: {loan.borrower?.name}</Typography>
          <Typography>Phone: {loan.borrower?.phone}</Typography>
          <Typography>Email: {loan.borrower?.email}</Typography>

          {/* Agent Section */}
          {loan.assignedAgent && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AccountCircleIcon sx={{ mr: 1 }} /> Assigned Agent
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.4)", mb: 1 }} />

              <Typography>Name: {loan.assignedAgent?.name}</Typography>
              <Typography>Email: {loan.assignedAgent?.email}</Typography>
            </>
          )}

          {/* Loan Data */}
          <Typography
            variant="h6"
            sx={{ mt: 3, display: "flex", alignItems: "center" }}
          >
            <MoneyIcon sx={{ mr: 1 }} /> Loan Information
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.4)", mb: 1 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <MoneyIcon sx={{ fontSize: 18, mr: 1 }} />
                Principal:
              </Typography>
              <Typography fontWeight="bold">₹{loan.principalAmount}</Typography>
            </Grid>

            

            <Grid item xs={6}>
              <Typography>
                <PaidIcon sx={{ fontSize: 18, mr: 1 }} />
                Installment Amount:
              </Typography>
              <Typography fontWeight="bold">
                ₹{loan.installmentAmount}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <PendingActionsIcon sx={{ fontSize: 18, mr: 1 }} />
                Installments:
              </Typography>
              <Typography fontWeight="bold">
                {loan.installmentCount}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <PaidIcon sx={{ fontSize: 18, mr: 1 }} />
                Amount Paid:
              </Typography>
              <Typography fontWeight="bold">
                ₹{loan.amountPaidByBorrower}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                <PendingActionsIcon sx={{ fontSize: 18, mr: 1 }} />
                Remaining:
              </Typography>
              <Typography fontWeight="bold">₹{loan.remainingAmount}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <CalendarMonthIcon sx={{ mr: 1 }} />
                Start Date:
              </Typography>
              <Typography fontWeight="bold">
                {new Date(loan.startDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          {/* Deductions Section */}
          <Typography
            variant="h6"
            sx={{ mt: 3, display: "flex", alignItems: "center" }}
          >
            <MoneyIcon sx={{ mr: 1 }} /> Deductions Summary
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.4)", mb: 1 }} />

          <Typography>
            Initial Interest Deduction:{" "}
            <strong>₹{loan.initialInterestDeduction}</strong>
          </Typography>

          <Typography>
            Amount Given to Borrower (Cash in Hand):{" "}
            <strong>₹{loan.amountPaidToBorrower}</strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoanDetail;
