import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllPaymentsQuery } from "../slices/paymentsApiSlice";

import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PaidIcon from "@mui/icons-material/Paid";

const PaymentList = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const role = userInfo?.role;

  const { data: payments, isLoading, error } = useGetAllPaymentsQuery();

  if (isLoading)
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading payments...
      </Typography>
    );

  if (error)
    return (
      <Typography align="center" mt={5} color="error">
        Failed to load payments
      </Typography>
    );

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        gutterBottom
        sx={{ mb: 3, color: "#3f51b5" }}
      >
        💰 Payment Records
      </Typography>

      <Grid container spacing={2}>
        {payments?.map((payment) => (
          <Grid item xs={12} key={payment._id}>
            <Card
              sx={{
                borderRadius: 3,
                padding: 1,
                background:
                  "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                color: "#333",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <CardContent>
                {/* Borrower and Agent */}
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  {payment.borrower?.name}
                </Typography>

                <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Agent: {payment.agent?.name}
                </Typography>

                {/* Loan Info */}
                <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  Amount Paid: ₹{payment.amountPaid}
                </Typography>

                <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  Remaining Loan: ₹{payment.loanId?.remainingAmount}
                </Typography>

                <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarMonthIcon sx={{ mr: 1 }} />
                  Payment Date:{" "}
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </Typography>

                {/* Loan Status */}
                <Chip
                  label={payment.loanId?.status?.toUpperCase()}
                  color={
                    payment.loanId?.status === "active"
                      ? "success"
                      : payment.loanId?.status === "completed"
                      ? "primary"
                      : "error"
                  }
                  sx={{ mt: 1, fontWeight: "bold" }}
                />

                {/* Action Buttons */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <IconButton
                     onClick={() => navigate(`/payment/view/${payment.loanId._id}`)}
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  
                    {/* <IconButton
                      onClick={() => navigate(`/payment/${payment.loanId._id}/add`)}
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.1)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
                      }}
                    >
                      <EditIcon />
                    </IconButton> */}
                  
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PaymentList;
