"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
export default function WelcomePage() {
  const router = useRouter();
  const { userData } = useSelector((state) => state?.auth || {});
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!userData) {
      router.push("/user/login");
    }
  }, [userData, router]);

  if (pageLoading) {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/assets/css/login.css" />
        <style jsx>{`
          .loader-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #060918 0%, #0a0f2a 100%);
            z-index: 9999;
          }
          .loader-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(139, 92, 246, 0.2);
            border-top: 3px solid #07dbc7;
            border-right: 3px solid #22d3ee;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loader-text {
            margin-top: 20px;
            color: #07dbc7;
            font-family: monospace;
            font-size: 14px;
            letter-spacing: 2px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
        <div className="loader-container">
          <div style={{ textAlign: "center" }}>
            <div className="loader-spinner"></div>
            <div className="loader-text">LOADING</div>
          </div>
        </div>
      </>
    );
  }

  if (!userData) return null;

  const { name, authLogin, authPassword, email } = userData;

  return (
    <>
      {/* Bootstrap CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      />
      <link rel="stylesheet" href="/assets/css/login.css" />

      {/* Full-screen container */}
      <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 position-relative overflow-hidden login-bg">
        {/* Orb - purple top-left */}
        <div className="position-absolute rounded-circle pe-none orb-purple" />

        {/* Orb - cyan bottom-right */}
        <div className="position-absolute rounded-circle pe-none orb-cyan" />

        {/* Orb - center */}
        <div className="position-absolute top-50 start-50 translate-middle rounded-circle pe-none orb-center" />

        {/* Card */}
        <div className="position-relative z-1 w-100 px-4 px-md-5 py-5 rounded-4 login-card">
          {/* Top shimmer line */}
          <div className="position-absolute top-0 start-50 translate-middle-x shimmer-line" />

          {/* Logo */}
          <div className="d-flex justify-content-center mb-2">
            <a href='/'>
              <img src="LOG02.png" alt="Logo" className="login-logo" />
            </a>
          </div>

          {/* Welcome divider */}

          <div className="d-flex align-items-center gap-3 mt-4 mb-4">
            <div className="flex-grow-1 divider-line" />
            <span className="signin-text">Welcome</span>
            <div className="flex-grow-1 divider-line" />
          </div>
          {/* Welcome message */}
          <p className="welcome-message">
            We're excited to have you join our community. Earn rewards and
            bonuses by referring friends and family.
          </p>

          {/* Sub heading */}
          <h2 className="welcome-subheading">Your Account Details</h2>

          {/* Info rows */}
          <div className="welcome-info-container">
            {/* Name */}
            <div className="welcome-info-row">
              <span className="welcome-label">Name:</span>
              <span className="welcome-value">{name || "Not provided"}</span>
            </div>

            {/* Email */}
            <div className="welcome-info-row">
              <span className="welcome-label">Email:</span>
              <span className="welcome-value">{email || "Not provided"}</span>
            </div>

            {/* User Id */}
            <div className="welcome-info-row">
              <span className="welcome-label">User Id:</span>
              <span className="welcome-value">{authLogin || "Not provided"}</span>
            </div>

            {/* Password */}
            <div className="welcome-info-row">
              <span className="welcome-label">Password:</span>
              <span className="welcome-password-value">{authPassword || "Not provided"}</span>
            </div>
          </div>

          {/* Login button */}
          <button
            type="button"
            onClick={() => router.push("/user/login")}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase mt-2 login-submit "
          >
            Login Now
          </button>

          {/* Footer note */}
          <p className="welcome-footer-note">
            Congratulations! Your account has been successfully created. Check
            your inbox for an email that includes your login details. Make sure
            to store this email in a secure place.
          </p>
        </div>
      </div>
    </>
  );
}