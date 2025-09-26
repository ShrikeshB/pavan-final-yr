import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SubscriptionDetails.scss";
import { useNavigate } from "react-router-dom";
import NavBar from "../../component/navbar/NavBar";

const SubscriptionDetails = ({ uid }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    checkForTokens();
  }, [navigate]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const detail = await axios.post(
          "http://localhost:3001/api/getSubscriptionDetails",
          { uid: userId }
        );

        const check = await axios.post(
          "http://localhost:3001/api/hasActiveSubscription",
          { uid: userId }
        );
        console.log(check.data.active);

        setActivePlan(check.data.active);
        setSubscription(detail.data.subscription);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSubscription();
  }, [userId]);

  if (loading)
    return <div className="subscription-card">Loading subscription...</div>;

  if (!subscription) {
    return (
      <div className="subscription-card">No active subscription found.</div>
    );
  }

  const { purchasedAt, expireAt, createdAt } = subscription;

  return (
    <>
      <NavBar />
      <div className="subscription-card">
        <h2>Subscription Details</h2>
        <div className="detail">
          <span>📅 Purchased At:</span>
          <span>{new Date(purchasedAt).toLocaleString()}</span>
        </div>
        <div className="detail">
          <span>⏳ Expires At:</span>
          <span>{new Date(expireAt).toLocaleString()}</span>
        </div>
        <div className="detail">
          <span>🕒 Created At:</span>
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
        <h1 className={activePlan ? "" : "expired"}>
          Plan - {activePlan ? "Active" : "Expired!"}
        </h1>
        {!activePlan ? (
          <center>
            <a href="/pricing">update plan</a>
          </center>
        ) : null}
      </div>
    </>
  );
};

export default SubscriptionDetails;
