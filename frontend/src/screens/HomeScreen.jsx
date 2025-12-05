import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

import {
  Container,
  Row,
  Col,
  Card
} from "react-bootstrap";

import {
  FaBox,
  FaList,
  FaTags,
  FaShoppingCart,
  FaWarehouse,
  FaPlusCircle,
  FaTruck,
  FaClipboardCheck,
  FaUserCog,
  FaBell,
  FaSignOutAlt,
  FaCubes,
  FaChartBar,
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";

import Nutrition from "../assets/NutritionLogo.png";
import "../css/HomeScreen.css";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const role = userInfo?.role;

  // -------------------------
  // ROLE → NAVIGATION BUTTONS
  // -------------------------
  const roleNavigation = {
    admin: [
      { title: "Loan Creation", path: "/admin/loan", icon: <FaBox /> },
      { title: "Loan Creation Already Started", path: "/admin/loanProgress", icon: <FaBox /> },
      { title: "Todays Payment", path: "/admin/todaysPayment", icon: <FaTags /> },
      { title: "Yesterdays Payment", path: "/admin/yesterdaysPayments", icon: <FaTags /> },
      { title: "Payment Report", path: "/admin/paymentreport", icon: <FaTags /> },
      { title: "Loan List", path: "/loanList", icon: <FaTags /> },
      { title: "Payment List", path: "/paymentlist", icon: <FaList /> },
      { title: "User List", path: "/admin/userlist", icon: <FaWarehouse /> },
      
    ],

    "Collecting Agent": [
      { title: "Loan List", path: "/loanList", icon: <FaTags /> },
      { title: "Payment List", path: "/paymentlist", icon: <FaList /> },
    ],
   
  };

  const selectedNavigation = roleNavigation[role] || [];

  const gradientColors = [
    "#ff9966, #ff5e62",
    "#36D1DC, #5B86E5",
    "#667db6, #0082c8",
    "#fc5c7d, #6a82fb",
    "#ff758c, #ff7eb3",
    "#43e97b, #38f9d7",
    "#c471f5, #fa71cd",
    "#f7971e, #ffd200",
  ];

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const GradientCard = ({ item, index }) => (
    <Card
      className="option-card text-center p-3 shadow-sm"
      style={{
        border: "none",
        color: "white",
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${gradientColors[index % gradientColors.length]})`,
        cursor: "pointer",
        transition: "0.2s",
      }}
      onClick={() => navigate(item.path)}
    >
      <div style={{ fontSize: "1.8rem" }}>{item.icon}</div>
      <h6 className="mt-2 fw-bold">{item.title}</h6>
    </Card>
  );

  return (
    <Container className="py-4">
      {/* Logo */}
      <div className="text-center mb-4">
        <img src={Nutrition} alt="Logo" style={{ maxWidth: "160px" }} />
      </div>

      {/* Welcome */}
      <h4 className="text-center fw-bold text-primary mb-4">
        Welcome, {role?.toUpperCase()}
      </h4>

      {/* Navigation Cards */}
      <Row className="g-3">
        {selectedNavigation.map((item, index) => (
          <Col key={index} xs={6} sm={4} md={3} lg={3}>
            <GradientCard item={item} index={index} />
          </Col>
        ))}

        {/* Logout always visible */}
        <Col xs={6} sm={4} md={3} lg={3}>
          <Card
            className="option-card text-center p-3 shadow-sm"
            style={{
              border: "none",
              color: "white",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #434343, #000000)",
              cursor: "pointer",
            }}
            onClick={logoutHandler}
          >
            <FaSignOutAlt size={28} />
            <h6 className="mt-2 fw-bold">Logout</h6>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;
