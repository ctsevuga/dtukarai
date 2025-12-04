import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetPaymentReportQuery } from "../../slices/paymentsApiSlice";
import { useGetAllBorrowersQuery } from "../../slices/borrowersApiSlice";

import {
  FilterAlt,
  DateRange,
  Person,
  Refresh,
} from "@mui/icons-material";

import { MdAssignment } from "react-icons/md";
import { FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";
import "../../css/PaymentReport.css";

const PaymentReport = () => {
  const [filters, setFilters] = useState({
    borrowerId: "",
    loanId: "",
    agentId: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();
  const { data: borrowersData } = useGetAllBorrowersQuery();

  // IMPORTANT: Rename `data` to `paymentData`
  const {
    data: paymentData,
    isLoading,
    refetch,
  } = useGetPaymentReportQuery(filters);
  

  // Calculate Total Paid to Borrower (frontend)
  const totalPaidToBorrower = paymentData?.data?.reduce(
    (sum, p) => sum + (p.loanId?.amountPaidToBorrower || 0),
    0
  )?.toFixed(2);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      borrowerId: "",
      loanId: "",
      agentId: "",
      startDate: "",
      endDate: "",
    });
    refetch();
  };

  return (
    <div className="container mt-3 mb-5">
      <h3 className="text-center fw-bold text-primary mb-3">
        <FilterAlt className="me-2" />
        Payment Report
      </h3>

      {/* FILTER CARD */}
      <Card className="shadow-sm p-3 mb-4 border-0" style={{ borderRadius: 12 }}>
        <Row className="gy-3">
          {/* Borrower */}
          <Col xs={12} md={6} lg={4}>
            <Form.Label>
              <Person className="me-1 text-success" /> Borrower
            </Form.Label>
            <Form.Select
              name="borrowerId"
              value={filters.borrowerId}
              onChange={handleChange}
            >
              <option value="">All Borrowers</option>
              {borrowersData?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.phone})
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Start Date */}
          <Col xs={12} md={6} lg={4}>
            <Form.Label>
              <DateRange className="me-1 text-primary" /> Start Date
            </Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </Col>

          {/* End Date */}
          <Col xs={12} md={6} lg={4}>
            <Form.Label>
              <DateRange className="me-1 text-danger" /> End Date
            </Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </Col>

          {/* Action Buttons */}
          <Col xs={12} className="text-center mt-2">
            <Button variant="primary" className="me-2 px-4" onClick={() => refetch()}>
              <FilterAlt /> Apply Filter
            </Button>

            <Button variant="secondary" className="px-4" onClick={clearFilters}>
              <Refresh /> Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* RESULTS */}
      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading report...</p>
        </div>
      ) : paymentData?.data?.length === 0 ? (
        <p className="text-center text-muted mt-4">No payments found for selected filters.</p>
      ) : (
        <>
          {/* SUMMARY */}
          <Card className="shadow-sm mb-4 p-3 border-0">
            <Row className="text-center">

              <Col xs={3}>
                <h6 className="text-muted">Total Payments</h6>
                <h4 className="fw-bold text-success">
                  <MdAssignment className="me-1" />
                  {paymentData?.totalPayments}
                </h4>
              </Col>

              <Col xs={3}>
                <h6 className="text-muted">Total Amount Paid</h6>
                <h4 className="fw-bold text-primary">
                  <FaMoneyBillWave className="me-1" />
                  {paymentData?.totalAmountPaid}
                </h4>
              </Col>

              <Col xs={3}>
                <h6 className="text-muted">Total Paid To Borrower</h6>
                <h4 className="fw-bold text-warning">
                  <FaHandHoldingUsd className="me-1" />
                  {totalPaidToBorrower}
                </h4>
              </Col>

              {/* NEW — Total Principal Amount */}
              <Col xs={3}>
                <h6 className="text-muted">Total Principal Amount</h6>
                <h4 className="fw-bold text-danger">
                  ₹ {paymentData?.totalPrincipalAmount?.toFixed(2)}
                </h4>
              </Col>

            </Row>
          </Card>

          {/* PAYMENT TABLE LIST */}
          <Card className="shadow-sm border-0 p-3 mt-3">
            <div className="table-responsive">
              <table className="responsive-table">
                <thead>
                  <tr className="text-center">
                    <th>Borrower</th>
                    <th>Amount Paid</th>
                    <th>Paid On</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentData?.data?.map((p) => (
                    <tr key={p._id}>
                      <td data-label="Borrower">
                        {p.borrower?.name} ({p.borrower?.phone})
                      </td>

                      <td data-label="Amount Paid">
                        <strong className="text-success">₹ {p.amountPaid}</strong>
                      </td>

                      <td data-label="Paid On">
                        {new Date(p.paymentDate).toLocaleString()}
                      </td>

                      <td data-label="Action" className="text-center">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => navigate(`/loan/${p.loanId?._id}`)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default PaymentReport;
