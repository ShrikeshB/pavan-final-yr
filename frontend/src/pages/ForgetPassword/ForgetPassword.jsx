import React, { useRef, useState } from "react";
import "./style/ForgetPassword.scss";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

import OTP from "../../component/OTP/OTP";
import Loader from "../../component/loader/Loader";

export default function ForgetPassword() {
  const OTP_ref = useRef();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(null);
  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const initialValues2 = {
    password: "",
    confirmpassword: "",
  };
  const validationSchema2 = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmpassword: Yup.string()
      .min(6, "Confirm password must be at least 6 characters")
      .required("Confirm password is required"),
  });

  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const handleChangePassword = async (values, { resetForm }) => {
    if (values.password !== values.confirmpassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!isOTPVerified) {
      alert("Please verify the OTP before proceeding.");
      return;
    }

    try {
      setLoading(true);
      const data = {
        email: values.email, // ensure this is passed from the form
        password: values.password,
      };

      const response = await axios.post(
        "http://localhost:3001/api/user/updatePassword",
        data
      );

      if (response.status === 200) {
        alert("Password updated successfully.");
        resetForm();
        window.location.href = "/login";
      } else {
        alert(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      setLoading(false);

      console.error("Error updating password:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //! verify the OTP and than add user to DB
  const handleOTPVerification = (userCodeInput) => {
    console.log("userCodeInput " + userCodeInput);
    console.log("generatedCode " + generatedCode);
    setLoading(true);

    try {
      if (parseInt(userCodeInput, 10) === generatedCode) {
        alert("OTP Verified Successfully!");
        OTP_ref.current?.classList.remove("active");
        setIsOTPVerified(true);

        setLoading(false);
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const generateNewOTP = async (values) => {
    setLoading(true);

    const data = {
      email: values.email,
    };
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/checkForExistingEmailForForgetPassword",
        data
      );

      console.log(response);
      // if the email already exist then send otp and open otp form
      if (
        response.status === 201 &&
        response.data.message === "Email already exists"
      ) {
        console.log("email is registered!");

        if (OTP_ref.current) {
          OTP_ref.current.classList.add(true);
        }

        const newCode = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
        setGeneratedCode(newCode);
        console.log("Generated OTP:", newCode);
        OTP_ref.current?.classList.add("active");
        setLoading(false);
        await sendMail(values, newCode);
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.status === 409) {
        alert("No such email");
      } else {
        console.error("OTP generation error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMail = async (values, code) => {
    const data = {
      generatedCode: code,
      email: values.email,
    };
    try {
      setLoading(true);
      console.log("sending mail");

      const response = await axios.post(
        "http://localhost:3001/api/mails/sendMail",
        data
      );
      console.log(response);

      if (response.status === 200) {
        alert("email has sent");
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ForgetPassword">
      {loading && <Loader />}

      <OTP
        ref={OTP_ref}
        handleOTPVerification={handleOTPVerification}
        generateNewOTP={generateNewOTP}
      />

      {!isOTPVerified ? (
        <div className="myform">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema} // Add this line
            onSubmit={generateNewOTP}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="head">
                  <h2>Welcome to Imagify!</h2>
                  <p>change your password</p>
                </div>

                <div className="form-group">
                  <Field
                    type="email"
                    id="email"
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

                <button
                  type="submit"
                  className="primary form-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Send OTP"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="myform">
          <Formik
            initialValues={initialValues2}
            validationSchema={validationSchema2} // Add this line
            onSubmit={handleChangePassword}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="head">
                  <h2>Welcome To DataMinds</h2>
                  <p>Place where model building magic happens</p>
                </div>

                <div className="form-group">
                  <Field
                    type="password"
                    id="password"
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
                    id="confirmpassword"
                    name="confirmpassword"
                    className="form-input"
                    placeholder="confirm password"
                  />
                  <ErrorMessage
                    name="confirmpassword"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="primary form-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Change Password"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
