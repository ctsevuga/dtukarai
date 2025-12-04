import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useGetAllLoansQuery } from "../slices/loansApiSlice";
import { useGetAllBorrowersQuery } from "../slices/borrowersApiSlice";

import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";

import { useNavigate } from "react-router-dom";

const LoanList = () => {
  const navigate = useNavigate();

  // Loan Data
  const { data: loans, isLoading, error } = useGetAllLoansQuery();

  // Borrower Data
  const {
    data: borrowers,
    isLoading: loadingBorrowers,
    error: borrowerError,
  } = useGetAllBorrowersQuery();

  // UI State for filtering
  const [selectedBorrower, setSelectedBorrower] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // NEW: status filter

  // Filter loans based on selected borrower & status
  const filteredLoans = loans?.filter((loan) => {
    const borrowerMatch = selectedBorrower
      ? loan.borrower?._id === selectedBorrower
      : true;
    const statusMatch = selectedStatus ? loan.status === selectedStatus : true;
    return borrowerMatch && statusMatch;
  });

  // ---------------------------
  // LOADING & ERROR HANDLING
  // ---------------------------
  if (isLoading || loadingBorrowers)
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading data...
      </Typography>
    );

  if (error || borrowerError)
    return (
      <Typography align="center" mt={5} color="error">
        Failed to load data
      </Typography>
    );

  return (
    <Box sx={{ padding: 2 }}>
      {/* ============================================ */}
      {/*   FILTER SECTION                             */}
      {/* ============================================ */}
      <Card sx={{ padding: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Filter Loans
        </Typography>

        <Grid container spacing={2}>
          {/* Borrower Dropdown */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Borrower</InputLabel>
              <Select
                value={selectedBorrower}
                label="Select Borrower"
                onChange={(e) => setSelectedBorrower(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Borrowers</em>
                </MenuItem>
                {borrowers?.map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status Dropdown */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Select Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* ============================================ */}
      {/*              EXISTING LOAN LIST              */}
      {/* ============================================ */}
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        gutterBottom
        sx={{ mb: 3, color: "#3f51b5" }}
      >
        📋 Loan Records
      </Typography>

      <Grid container spacing={2}>
        {filteredLoans?.map((loan) => (
          <Grid item xs={12} key={loan._id}>
            <Card
              sx={{
                borderRadius: 3,
                padding: 1,
                background: "linear-gradient(135deg, #2196f3, #21cbf3)",
                color: "white",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <CardContent>
                {/* Borrower Name */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <PersonIcon sx={{ mr: 1 }} /> {loan.borrower?.name}
                </Typography>

                {/* Agent */}
                {loan.assignedAgent && (
                  <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    Agent: {loan.assignedAgent?.name}
                  </Typography>
                )}

                {/* Principal */}
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  Principal: ₹{loan.principalAmount}
                </Typography>

                {/* Interest */}
                <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <PercentIcon sx={{ mr: 1 }} />
                  Interest Rate: {loan.interestRate}%
                </Typography>

                {/* Start Date */}
                <Typography sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <CalendarMonthIcon sx={{ mr: 1 }} />
                  Start Date: {new Date(loan.startDate).toLocaleDateString()}
                </Typography>

                {/* Loan Status */}
                <Chip
                  label={loan.status.toUpperCase()}
                  color={
                    loan.status === "active"
                      ? "success"
                      : loan.status === "completed"
                      ? "primary"
                      : "error"
                  }
                  sx={{ mt: 2, fontWeight: "bold" }}
                />

                {/* Action Buttons */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <IconButton
                    onClick={() => navigate(`/loan/${loan._id}`)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate(`/loan/${loan._id}/edit`)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate(`/payment/${loan._id}/add`)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <PaymentsIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LoanList;
