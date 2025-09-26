import React from "react";
import axios from "axios";
import "./NavBar.scss";
import { useEffect } from "react";
import { useState } from "react";
const NavBar = () => {
  const [userId, setUserId] = useState(null);

  const checkForTokens = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/user/verifytoken",
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      if (response.data.valid) {
        console.log("Token is valid. User:", response.data.user);
        setUserId(response.data.user.userId); // Assuming `setUser` updates user state
        localStorage.setItem("uid", response.data.user.userId);
      } else {
        console.log("Token is invalid or expired.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Error response from server:", err.response.data.message);
      } else {
        console.error("Network or other error:", err.message);
      }
      console.log("Auto-login failed.");
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/logout",
        {},
        { withCredentials: true }
      ); // Ensure cookies are sent
      // Optionally clear frontend state or localStorage
      localStorage.removeItem("user"); // or remove token, etc.
      alert("Logged out successfully");
      // Redirect to login page or home
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Try again.");
    }
  };

  useEffect(() => {
    checkForTokens();
  }, []);

  return (
    <div className="navbar">
      <div>
        <a href="/">
          <h1 className="logo">Imgify</h1>
        </a>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/pricing">Pricing</a>
        </li>
        <li>
          <a href="aboutUs">About us</a>
        </li>
        <li>
          <a href="contact">Contact us</a>
        </li>
        <li>
          <a href="howToUse">How to use</a>
        </li>
        <li>
          <a href="subscriptionDetails">My Subscription</a>
        </li>
      </ul>
      {!userId ? (
        <button
          className="auth-btn"
          onClick={() => {
            window.location = "/login";
          }}
        >
          Log in / Sign up
        </button>
      ) : (
        <button className="auth-btn" onClick={handleLogout}>
          logout
        </button>
      )}
    </div>
  );
};

export default NavBar;
