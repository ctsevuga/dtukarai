import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());     // Clear Redux store
    navigate("/");     // Redirect to login
  };

  return (
    <header>
      <Navbar bg="light" expand="lg" className="shadow-sm py-2">
        <Container>

          {/* Logo */}
          <LinkContainer to="/home">
            <Navbar.Brand className="d-flex align-items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                height="40"
                className="rounded-circle"
              />
              <span className="fw-bold">DTU Karai</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">

              <LinkContainer to="/home">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center gap-1">
                      <FaUser />
                      {userInfo.name}
                    </span>
                  }
                  id="user-menu"
                  align="end"
                >
                  

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/">
                  <Nav.Link>
                    <FaUser className="me-1" />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
