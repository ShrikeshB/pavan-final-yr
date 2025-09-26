import React, { useState, useRef } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Signup.scss";
import OTP from "../../component/OTP/OTP";
import Loader from "../../component/loader/Loader";
import "./Signup.scss";

// Assuming you have a Loader

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const OTP_ref = useRef();

  const initialValues = {
    uname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    uname: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const sendMail = async (values, code) => {
    const data = {
      generatedCode: code,
      email: values.email,
    };
    try {
      const response = await axios.post(
        "http://localhost:3001/api/mails/sendMail",
        data
      );

      if (response.status === 200) {
        alert("Verification email has been sent");
      }
    } catch (err) {
      console.error("Mail error:", err);
    }
  };

  const generateNewOTP = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/user/checkForExistingEmail",
        { email: values.email }
      );

      if (response.status === 200 && response.data.message === "New email") {
        const newCode = Math.floor(1000 + Math.random() * 9000);
        setGeneratedCode(newCode);
        console.log("Generated OTP:", newCode);

        OTP_ref.current?.classList.add("active");
        await sendMail(values, newCode);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Email already registered. Try logging in.");
      } else {
        console.error("OTP generation error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values, resetForm) => {
    console.log(values);

    try {
      const res = await axios.post("http://localhost:3001/api/user/signup", {
        uname: values.uname,
        email: values.email,
        password: values.password,
      });

      alert("Signup successful!");
      resetForm();
      window.location = "/login";
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      alert(msg);
    }
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    if (isOTPVerified) {
      await handleSignup(values, resetForm);
    } else {
      await generateNewOTP(values);
    }
    setSubmitting(false);
  };

  const handleOTPVerification = (userCodeInput) => {
    if (parseInt(userCodeInput, 10) === generatedCode) {
      alert("OTP Verified Successfully!");
      setIsOTPVerified(true);
      OTP_ref.current?.classList.remove("active");
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <OTP
        ref={OTP_ref}
        handleOTPVerification={handleOTPVerification}
        generateNewOTP={generateNewOTP}
      />
      <div className="signup-container">
        <div className="signup-box">
          <h1 className="welcome-text">Welcome to Imagify!</h1>
          <h2 className="form-title">Sign up</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <Field
                    type="text"
                    id="uname"
                    name="uname"
                    className="form-input"
                    placeholder="username"
                  />
                  <ErrorMessage
                    name="uname"
                    component="div"
                    className="error"
                  />
                </div>  
                <div className="form-group">
                  <Field
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <Field
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="signup-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Sign Up"}
                </button>

                <a href="/login" className="login-text">
                  Already Have Account?
                </a>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Signup;
