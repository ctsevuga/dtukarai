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

import { useCreateLoanMutation } from "../../slices/loansApiSlice";
import { useGetAllBorrowersQuery } from "../../slices/borrowersApiSlice";

import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const LoanCreateForm = () => {
  const [createLoan, { isLoading }] = useCreateLoanMutation();
  const { data: borrowers, isLoading: borrowerLoading } = useGetAllBorrowersQuery();

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
    interestRate: "",
    installmentCount: "",
    startDate: "",
  };

  const validationSchema = Yup.object({
    assignedAgent: Yup.string().required("Agent ID required"),
    principalAmount: Yup.number().required().positive(),
    interestRate: Yup.number().required(),
    installmentCount: Yup.number().required().positive(),
    startDate: Yup.date().required("Start date required"),

    // Conditional validation
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
          ? {
              name: values.borrowerName,
              phone: values.borrowerPhone,
            }
          : values.borrower,
        assignedAgent: values.assignedAgent,
        principalAmount: values.principalAmount,
        interestRate: values.interestRate,
        installmentCount: values.installmentCount,
        startDate: values.startDate,
      };

      await createLoan(payload).unwrap();
      toast.success("Loan created successfully!");
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Error creating loan");
    }
  };

  if (borrowerLoading) {
    return (
      <Typography align="center" mt={5} variant="h6">
        Loading borrowers...
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
          📄 Create New Loan
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
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

                {/* Borrower Selection OR New Borrower Fields */}
                {!newBorrower ? (
                  <>
                    {/* Borrower Dropdown */}
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: "white" }}>
                          Select Borrower
                        </InputLabel>
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

                    {/* Show phone */}
                    {selectedBorrowerDetails && (
                      <Grid item xs={12}>
                        <Typography fontWeight="bold">
                          📞 Phone: {selectedBorrowerDetails.phone}
                        </Typography>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    {/* New Borrower Name */}
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

                    {/* New Borrower Phone */}
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

                {/* ------------------- OTHER FIELDS ---------------------- */}

                {/* Agent ID */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Agent ID"
                    name="assignedAgent"
                    value={values.assignedAgent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.assignedAgent && Boolean(errors.assignedAgent)
                    }
                    helperText={
                      touched.assignedAgent && errors.assignedAgent
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssignmentIndIcon sx={{ color: "white" }} />
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

                {/* Principal */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Principal Amount"
                    name="principalAmount"
                    type="number"
                    value={values.principalAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.principalAmount &&
                      Boolean(errors.principalAmount)
                    }
                    helperText={
                      touched.principalAmount && errors.principalAmount
                    }
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

                {/* Interest */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Interest Rate (%)"
                    name="interestRate"
                    type="number"
                    value={values.interestRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.interestRate && Boolean(errors.interestRate)
                    }
                    helperText={
                      touched.interestRate && errors.interestRate
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon sx={{ color: "white" }} />
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

                {/* Installments */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Installment Count"
                    name="installmentCount"
                    type="number"
                    value={values.installmentCount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.installmentCount &&
                      Boolean(errors.installmentCount)
                    }
                    helperText={
                      touched.installmentCount &&
                      errors.installmentCount
                    }
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

export default LoanCreateForm;
