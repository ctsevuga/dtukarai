import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import { useParams } from "react-router-dom";
import {
  useGetLoanByIdQuery,
  useUpdateLoanStatusMutation,
} from "../slices/loansApiSlice";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { toast } from "react-toastify";

const LoanStatusUpdate = () => {
  const { id } = useParams();

  const { data: loan, isLoading } = useGetLoanByIdQuery(id);
  const [updateLoanStatus, { isLoading: updating }] =
    useUpdateLoanStatusMutation();

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (loan) setStatus(loan.status);
  }, [loan]);

  const handleSubmit = async () => {
  try {
    await updateLoanStatus({ loanId: id, status }).unwrap();
    toast.success("Loan status updated successfully!");
  } catch (err) {
    toast.error(err?.data?.message || "Failed to update status.");
  }
};


  if (isLoading)
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading loan status...
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
          background: "linear-gradient(135deg, #00bcd4, #006064)",
          color: "white",
          boxShadow: "0px 6px 18px rgba(0,0,0,0.3)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{ mb: 2, textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
          >
            Update Loan Status
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", mb: 2 }} />

          {/* Current Status */}
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Current Status:
          </Typography>

          <Chip
            label={loan.status.toUpperCase()}
            color={
              loan.status === "active"
                ? "warning"
                : loan.status === "completed"
                ? "success"
                : "error"
            }
            sx={{ mb: 3, fontSize: 15, fontWeight: "bold" }}
          />

          {/* Dropdown */}
          <FormControl fullWidth>
            <Typography variant="subtitle1" mb={1} sx={{ fontWeight: "bold" }}>
              Change Status
            </Typography>

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{
                background: "white",
                borderRadius: 2,
                color: "#333",
                fontWeight: "bold",
                "& .MuiSelect-select": { py: 1.5 },
              }}
            >
              <MenuItem value="active">
                <HourglassEmptyIcon sx={{ mr: 1 }} /> Active
              </MenuItem>
              <MenuItem value="completed">
                <CheckCircleIcon sx={{ mr: 1, color: "green" }} /> Completed
              </MenuItem>
              <MenuItem value="overdue">
                <ErrorIcon sx={{ mr: 1, color: "red" }} /> Overdue
              </MenuItem>
            </Select>
          </FormControl>

          {/* Update Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={updating}
            sx={{
              mt: 4,
              py: 1.5,
              background: "linear-gradient(135deg, #ff9800, #f57c00)",
              fontWeight: "bold",
              fontSize: 16,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #fb8c00, #ef6c00)",
              },
            }}
            startIcon={<SwapHorizIcon />}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoanStatusUpdate;
