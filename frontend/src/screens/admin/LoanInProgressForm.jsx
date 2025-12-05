import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from "@mui/material";

import { useCreateLoanInProgressMutation } from "../../slices/loansApiSlice";
import { useGetAllBorrowersQuery } from "../../slices/borrowersApiSlice";
import { useGetCollectingAgentsQuery } from "../../slices/usersApiSlice";   // ✅ Added

import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const LoanInProgressForm = () => {
  const [createLoanInProgress, { isLoading }] = useCreateLoanInProgressMutation();
  const { data: borrowers, isLoading: borrowerLoading } = useGetAllBorrowersQuery();

  // ✅ Fetch agents for dropdown
  const { data: agents, isLoading: agentsLoading } = useGetCollectingAgentsQuery();

  const [newBorrower, setNewBorrower] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState("");

  const selectedBorrowerDetails = borrowers?.find(
    (b) => b._id === selectedBorrower
  );

  const initialValues = {
    borrower: "",
    borrowerName: "",
    borrowerPhone: "",
    assignedAgent: "",
    principalAmount: "",
    installmentCount: "",
    amountPaidToBorrower: "",
    amountPaidByBorrower: "",
    startDate: "",
  };

  const validationSchema = Yup.object({
    assignedAgent: Yup.string().required("Agent required"),
    principalAmount: Yup.number().required().positive(),
    installmentCount: Yup.number().required().positive(),
    amountPaidToBorrower: Yup.number()
      .required()
      .min(0, "Cannot be negative"),
    amountPaidByBorrower: Yup.number().required().min(0),
    startDate: Yup.date().required("Start date required"),

    borrower: Yup.string().when("newBorrower", {
      is: false,
      then: Yup.string().required("Borrower required"),
    }),
    borrowerName: Yup.string().when("newBorrower", {
      is: true,
      then: Yup.string().required("Borrower name required"),
    }),
    borrowerPhone: Yup.string().when("newBorrower", {
      is: true,
      then: Yup.string().required("Borrower phone required"),
    }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        newBorrower,
        borrower: newBorrower
          ? { name: values.borrowerName, phone: values.borrowerPhone }
          : values.borrower,

        // ✅ Sends ObjectId of selected agent
        assignedAgent: values.assignedAgent,

        principalAmount: Number(values.principalAmount),
        amountPaidToBorrower: Number(values.amountPaidToBorrower),
        installmentCount: Number(values.installmentCount),
        amountPaidByBorrower: Number(values.amountPaidByBorrower),
        startDate: values.startDate,
      };

      await createLoanInProgress(payload).unwrap();

      toast.success("Loan created successfully!");
      resetForm();
      setNewBorrower(false);
      setSelectedBorrower("");
    } catch (err) {
      toast.error(err?.data?.message || "Error creating loan");
    }
  };

  if (borrowerLoading || agentsLoading) {
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading data...
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
          color: "white",
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          📄 Create Loan In Progress
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* New Borrower Checkbox */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newBorrower}
                        onChange={(e) => {
                          setNewBorrower(e.target.checked);
                          setSelectedBorrower("");
                        }}
                        sx={{ color: "white" }}
                      />
                    }
                    label="New Borrower"
                  />
                </Grid>

                {/* Borrower Selection */}
                {!newBorrower ? (
                  <>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: "white" }}>Select Borrower</InputLabel>
                        <Select
                          name="borrower"
                          value={selectedBorrower}
                          label="Select Borrower"
                          onChange={(e) => {
                            handleChange(e);
                            setSelectedBorrower(e.target.value);
                          }}
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.15)",
                            color: "white",
                          }}
                        >
                          {borrowers?.map((b) => (
                            <MenuItem key={b._id} value={b._id}>
                              {b.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {selectedBorrowerDetails && (
                      <Grid item xs={12}>
                        <Typography fontWeight="bold">📞 Phone: {selectedBorrowerDetails.phone}</Typography>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Borrower Name"
                        name="borrowerName"
                        fullWidth
                        value={values.borrowerName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.borrowerName && Boolean(errors.borrowerName)}
                        helperText={touched.borrowerName && errors.borrowerName}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          input: { color: "white" },
                          label: { color: "white" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Borrower Phone"
                        name="borrowerPhone"
                        fullWidth
                        value={values.borrowerPhone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.borrowerPhone && Boolean(errors.borrowerPhone)}
                        helperText={touched.borrowerPhone && errors.borrowerPhone}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          input: { color: "white" },
                          label: { color: "white" },
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* AGENT DROPDOWN */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "white" }}>Select Agent</InputLabel>
                    <Select
                      name="assignedAgent"
                      value={values.assignedAgent}
                      label="Select Agent"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.assignedAgent && Boolean(errors.assignedAgent)}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                      }}
                    >
                      {agents?.map((agent) => (
                        <MenuItem key={agent._id} value={agent._id}>
                          {agent.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {touched.assignedAgent && errors.assignedAgent && (
                    <Typography color="error">{errors.assignedAgent}</Typography>
                  )}
                </Grid>

                {/* Principal Amount */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Principal Amount"
                    name="principalAmount"
                    type="number"
                    value={values.principalAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.principalAmount && Boolean(errors.principalAmount)}
                    helperText={touched.principalAmount && errors.principalAmount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      input: { color: "white" },
                      label: { color: "white" },
                    }}
                  />
                </Grid>

                {/* Amount Paid To Borrower */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount Paid To Borrower"
                    name="amountPaidToBorrower"
                    type="number"
                    value={values.amountPaidToBorrower}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.amountPaidToBorrower && Boolean(errors.amountPaidToBorrower)}
                    helperText={touched.amountPaidToBorrower && errors.amountPaidToBorrower}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      input: { color: "white" },
                      label: { color: "white" },
                    }}
                  />
                </Grid>

                {/* Amount Paid By Borrower */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount Paid By Borrower"
                    name="amountPaidByBorrower"
                    type="number"
                    value={values.amountPaidByBorrower}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.amountPaidByBorrower && Boolean(errors.amountPaidByBorrower)}
                    helperText={touched.amountPaidByBorrower && errors.amountPaidByBorrower}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      input: { color: "white" },
                      label: { color: "white" },
                    }}
                  />
                </Grid>

                {/* Installment Count */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Installment Count"
                    name="installmentCount"
                    type="number"
                    value={values.installmentCount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.installmentCount && Boolean(errors.installmentCount)}
                    helperText={touched.installmentCount && errors.installmentCount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaymentsIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      input: { color: "white" },
                      label: { color: "white" },
                    }}
                  />
                </Grid>

                {/* Start Date */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={values.startDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: "white" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      input: { color: "white" },
                      label: { color: "white" },
                    }}
                  />
                </Grid>

                {/* Submit */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      mt: 1,
                      py: 1.3,
                      background: "linear-gradient(45deg, #ff9800, #ff5722)",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {isLoading ? "Submitting..." : "Create Loan"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default LoanInProgressForm;
