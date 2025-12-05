import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";
import { Provider, useSelector } from "react-redux";
import store from "./store";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import Unauthorized from "./screens/Unauthorized";




// Admin Screens
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
import LoanCreateForm from "./screens/admin/LoanCreateForm";
import PaymentReport from "./screens/admin/PaymentReport";
import TodaysPayments from "./screens/admin/TodaysPayments";
import YesterdaysPayments from "./screens/admin/YesterdaysPayments";
import LoanInProgressForm from "./screens/admin/LoanInProgressForm";

import LoanList from "./screens/LoanList";
import LoanDetail from "./screens/LoanDetail";
import LoanStatusUpdate from "./screens/LoanStatusUpdate";
import LoanAddPayment from "./screens/LoanAddPayment";

import AddPayment from "./screens/AddPayment";
import PaymentList from "./screens/PaymentList";
import LoanPayments from "./screens/LoanPayments";
// Role-based Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";


// Example placeholder components for role dashboards

// Route wrapper component to use Redux state
const RouterWrapper = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        {/* Public Routes */}
        <Route index path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* For All roles with conditional - For Products*/}
        
        <Route
          path="/loanList"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <LoanList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan/:id"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <LoanDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan/:id/edit"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <LoanStatusUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan/:id/add"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <LoanAddPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:id/add"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <AddPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paymentlist"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <PaymentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/view/:loanId"
          element={
            <ProtectedRoute user={userInfo} allowedRoles={["Collecting Agent", "admin"]}>
              <LoanPayments />
            </ProtectedRoute>
          }
        />


        {/* Admin Routes */}
        <Route
          path="/admin/userlist"
          element={
            <AdminRoute user={userInfo}>
              <UserListScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user/:id/edit"
          element={
            <AdminRoute user={userInfo}>
              <UserEditScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/loan"
          element={
            <AdminRoute user={userInfo}>
              <LoanCreateForm />
            </AdminRoute>
          }
        />
        
         <Route
          path="/admin/paymentreport"
          element={
            <AdminRoute user={userInfo}>
              <PaymentReport />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/todaysPayment"
          element={
            <AdminRoute user={userInfo}>
              <TodaysPayments />
            </AdminRoute>
          }
        />
         <Route
          path="/admin/yesterdaysPayments"
          element={
            <AdminRoute user={userInfo}>
              <YesterdaysPayments />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/loanProgress"
          element={
            <AdminRoute user={userInfo}>
              <LoanInProgressForm/>
            </AdminRoute>
          }
        />
       
        {/* Profile (optional - accessible by all roles) */}
        {/* <Route path="/profile" element={<ProfileScreen />} /> */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

// Mount React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterWrapper />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
