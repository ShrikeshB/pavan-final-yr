import React from "react";
import "./Pricing.scss";
import NavBar from "../../component/navbar/NavBar";
import Footer from "../../component/footer/Footer";
import icons from "../../iconLinks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import PayPal from "../../component/paypal/PayPal";

export default function Pricing() {
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

  const handleBilling = async (payment_id) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/addBilling",
        { uid: userId, payment_id: payment_id }
      );

      console.log(response);
      if (response.status == 201) {
        alert("payment success!");
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const loadRazorPay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
    });
  };

  const [data, setdata] = useState({});
  async function displayRazorPay(e) {
    e.preventDefault();

    const response1 = await axios.post(
      "http://localhost:3001/api/hasActiveSubscription",
      { uid: userId }
    );
    if (response1.data.active) {
      alert("plan exists");
      return;
    }

    const res = await loadRazorPay();

    if (!res) {
      alert("failed to load razor!!");
      return;
    }

    const data = {
      mobile: "1234567890",
      UID: "1",
    };

    await axios.post("http://localhost:3001/razorPay").then((t) => {
      console.log(t);
      setdata(t.data);
    });
    let amt = Number(999);
    const options = {
      key: "rzp_test_K9TyacZ1arXQTM", // Enter the Key ID generated from the Dashboard
      amount: amt * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: data.currency,
      name: "Imgify", //your business name
      description: "Test Transaction",
      order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // callback_url: "http://localhost:3000/PaymentStatus",
      handler: (res) => {
        console.log(res);
        //! call your API to add the data in Database..
        handleBilling(res.razorpay_payment_id);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "1234567890", //Provide the customer's phone number for better conversion rates
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

  return (
    <div className="pricing">
      <NavBar />

      <main>
        <div className="plan">
          <h1>Free Plan</h1>
          <h2>INR 0</h2>
          <ul>
            <li>
              <img src={icons.check} alt="" />
              <p>Preview Image</p>
            </li>
            <li>
              <img src={icons.no} alt="" />
              <p>Download Enhanced Image</p>
            </li>
          </ul>

          <button className="primary-btn">
            <p className="p1">Current Plan</p>
          </button>
        </div>
        <div className="plan">
          <h1>Pro Plan</h1>
          <h2>INR 999/month</h2>
          <ul>
            <li>
              <img src={icons.check} alt="" />
              <p>Preview Image</p>
            </li>
            <li>
              <img src={icons.check} alt="" />
              <p>Download Enhanced Image</p>
            </li>
          </ul>

          <button className="primary-btn" onClick={displayRazorPay}>
            <p className="p1">Subscribe</p>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
