import React, { useState, useRef, useEffect } from "react";
import "./style/OTP.css";
import icons from "../../IconsLinks";

function OTP(props, ref) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [key, setKey] = useState(0); // Key to re-render the component for new OTP
  const inputsRef = useRef([]);
  const optRef = useRef();

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if value is entered
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleReset = () => {
    setOtp(["", "", "", ""]);
    props.generateNewOTP();
    setKey((prevKey) => prevKey + 1); // Trigger re-render to simulate new OTP
  };

  const handleClose = () => {
    ref.current.classList.remove("active");
    handleReset();
  };

  //! handle when user submit the OTP
  const handleOnSubmitOTP = (e) => {
    e.preventDefault();
    const combinedOtp = otp.join("");

    if (combinedOtp.length < 4) {
      alert("OTP is not compelete");
      return;
    }

    // this is a callback function from signup component
    props.handleOTPVerification(combinedOtp);
  };

  return (
    <div className="otp" ref={ref}>
      <div className="container">
        <button className="opt-close" onClick={handleClose}>
          <img src={icons.close} alt="" />
        </button>
        <h3>Enter OTP</h3>

        <br />
        <form className="otp-form" action="" onSubmit={handleOnSubmitOTP}>
          <div className="otp-inputs">
            {otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="otp-input"
              />
            ))}
          </div>

          <button className="otp-button" type="submit">
            Submit
          </button>
          {/* <button
            type="button"
            className="resend-otp-btn"
            onClick={handleReset}
          >
            Resend OTP
          </button> */}
        </form>
      </div>
    </div>
  );
}

export default React.forwardRef(OTP);
