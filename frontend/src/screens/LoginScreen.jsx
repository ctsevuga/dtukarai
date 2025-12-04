import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  InputGroup,
} from "react-bootstrap";

import Garments from "../assets/Garments.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect after login
  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/home";

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // If already logged in → redirect
  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  // Phone number format validation
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      return toast.error("Please enter a valid 10-digit phone number");
    }

    try {
      // RTK Login → POST /api/users/auth
      const res = await login({ phone, password }).unwrap();

      // Save to Redux store
      dispatch(setCredentials(res));

      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Invalid phone or password");
    }
  };

  return (
    <div>
      {/* ========================= LOGIN SECTION ========================= */}
      <Container
        fluid
        className="py-3"
        style={{
          background: "linear-gradient(135deg, tomato 0%, #ff7043 100%)",
          minHeight: "80vh",
        }}
      >
        <Row className="align-items-center justify-content-center">
          {/* LEFT SIDE - LOGIN FORM */}
          <Col xs={12} md={6} className="px-4 mb-4 mb-md-0" style={{ zIndex: 2 }}>
            <Card
              className="shadow-lg border-0"
              style={{
                backgroundColor: "#ffffffdd",
                backdropFilter: "blur(10px)",
              }}
            >
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 fw-bold" style={{ color: "tomato" }}>
                  Welcome to DTU Karaikudi 👗
                </h2>

                <Form onSubmit={submitHandler}>
                  {/* PHONE NUMBER */}
                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label className="fw-semibold">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      required
                    />
                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-danger"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {/* SUBMIT BUTTON */}
                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 fw-bold"
                    disabled={isLoading}
                    style={{
                      backgroundColor: "tomato",
                      borderColor: "tomato",
                    }}
                  >
                    {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
                  </Button>

                  {/* LINKS */}
                  <div className="text-center mt-3">
                    <p>
                      New User?{" "}
                      <a href="/register" className="text-danger fw-semibold">
                        Register
                      </a>
                    </p>
                    
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT SIDE IMAGE */}
          <Col
            xs={12}
            md={6}
            className="d-flex justify-content-center align-items-center mt-3"
            style={{ marginBottom: "2rem" }}
          >
            <img
              src={Garments}
              alt="Garments"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "420px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>

      {/* Your additional garment info section remains unchanged */}
    </div>
  );
};

export default LoginScreen;
