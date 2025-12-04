import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaChevronLeft,
} from "react-icons/fa";

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setRole(user?.role || "");
      setPhone(user?.phone || "");
      setAddress(user?.address?.address || "");
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId,
        role,
      });

      toast.success("User role updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link
        to="/admin/userlist"
        className="btn btn-light my-3 d-flex align-items-center"
        style={{
          width: "130px",
          background: "#f0f0f0",
          borderRadius: "30px",
        }}
      >
        <FaChevronLeft className="me-2" />
        Go Back
      </Link>

      <FormContainer>
        <Card
          className="p-4 shadow-lg border-0"
          style={{
            borderRadius: "20px",
            background:
              "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          }}
        >
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>
            <FaUserShield className="me-2" />
            Edit User Role
          </h2>

          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Form onSubmit={submitHandler}>
              {/* NAME */}
              <Form.Group className="my-3" controlId="name">
                <Form.Label className="fw-bold">
                  <FaUser className="me-2 text-primary" />
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  disabled
                  className="bg-light"
                />
              </Form.Group>

              {/* EMAIL */}
              <Form.Group className="my-3" controlId="email">
                <Form.Label className="fw-bold">
                  <FaEnvelope className="me-2 text-danger" />
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  disabled
                  className="bg-light"
                />
              </Form.Group>

              {/* PHONE */}
              <Form.Group className="my-3" controlId="phone">
                <Form.Label className="fw-bold">
                  <FaPhone className="me-2 text-success" />
                  Phone
                </Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  disabled
                  className="bg-light"
                />
              </Form.Group>

              {/* ADDRESS */}
              <Form.Group className="my-3" controlId="address">
                <Form.Label className="fw-bold">
                  <FaMapMarkerAlt className="me-2 text-warning" />
                  Address
                </Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  disabled
                  className="bg-light"
                />
              </Form.Group>

              {/* ROLE SELECT (Only Editable Field) */}
              <Form.Group className="my-3" controlId="role">
                <Form.Label className="fw-bold">
                  <FaUserShield className="me-2 text-info" />
                  Role (Editable)
                </Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="fw-bold border-primary"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="Unit Manager">Unit Manager</option>
                </Form.Select>
              </Form.Group>

              {/* SUBMIT BUTTON */}
              <div className="d-grid mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="py-2 fw-bold"
                  style={{
                    borderRadius: "30px",
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Update Role
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
