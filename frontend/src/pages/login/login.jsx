import React, { useState } from "react";
import axios from "axios";
import "./login.scss";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const res = await axios.post(
        "http://localhost:3001/api/user/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const { token, uid, uname } = res.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("uname", uname);
      localStorage.setItem("uid", uid);

      alert("Login successful!");
      // Optionally redirect user here
      window.location = "/";
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="welcome-text">Welcome to Imagify!</h1>
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="forgetPasswordLink">
            <a href="/forgetPassword">Forget Password?</a>
          </div>
          <button className="login-btn" type="submit">
            login
          </button>
        </form>
        <br /> <br />
        <a href="/signup" className="login-text">
          Don't have an account?
        </a>
      </div>
    </div>
  );
};

export default Login;
