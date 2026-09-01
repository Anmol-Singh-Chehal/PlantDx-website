import React from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoPageTopButton from "./components/GoPageTopButton";
import PageNotFound from "./components/PageNotFound";

import Home from "./pages/Home";
import Detection from "./pages/Detection";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Results from "./pages/Results";
import GetQueries from "./pages/GetQueries";

import ProtectedRoute from "./components/ProtectedRoute";

import { Route, Routes } from "react-router-dom";
import TermsAndPrivacy from "./pages/TermsAndPrivacy";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <Routes>
        {/* ============================================================
            PUBLIC ROUTES
        ============================================================ */}

        <Route path="/" element={<Home />} />

        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/detection" element={<Detection />} />

        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/log-in" element={<LogIn />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-code" element={<VerifyCode />} />

        <Route path="/terms-and-privacy" element={<TermsAndPrivacy/>} />

        {/* ============================================================
            PROTECTED ROUTES
        ============================================================ */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/get-queries"
          element={
            <AdminRoute>
              <GetQueries />
            </AdminRoute>
          }
        />

        {/* ============================================================
            404
        ============================================================ */}

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />

      <GoPageTopButton />
    </>
  );
}