import React, { useEffect, useState } from "react";
import "./Home.scss";
import NavBar from "../../component/navbar/NavBar";
import Footer from "../../component/footer/Footer";
import icons from "../../iconLinks";
import img from "../../assets/img/image.png";
import PayPal from "../../component/paypal/PayPal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../component/loader/Loader";

const Home = () => {
  const [uploadedImg, setUploadedImg] = useState(null);
  const [enhanceImg, setEnhanceImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImg(URL.createObjectURL(file));
      setImageFile(file);
    }
    console.log(file);
  };

  const handleEnhanceImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile); // matches multer field
    // setEnhanceImg(
    //   "https://imgs.search.brave.com/4W7IbJAxBKoTXBa6WZ-Bcsit96PbLnz0Fw08ApM6Lbo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vdUUwNVZu/ckRpb0JzYzRvSUti/MHhuLUU5T1ZiNEhm/NnlKSi05Yjd1QnVx/ay9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTl0/WldScC9ZUzVuWlhS/MGVXbHRZV2RsL2N5/NWpiMjB2YVdRdk1U/UTUvTkRFd05EWTBP/Uzl3YUc5MC9ieTlo/YVMxamFHRjBZbTkw/L0xXRnlkR2xtYVdO/cFlXd3QvYVc1MFpX/eHNhV2RsYm1ObC9M/V1JwWjJsMFlXd3RZ/Mjl1L1kyVndkQzVx/Y0djX2N6MDIvTVRK/NE5qRXlKbmM5TUNa/ci9QVEl3Sm1NOU1W/cHhNbk5xL00xY3dk/RmRqY0dNdGJqRm0v/Vm5RMFpGRlJUMEpI/YUhSMy9ZMEZyTVVn/eVpWRTFUVUZpL1NU/MA"
    // );
    try {
      const res = await axios.post(
        "http://localhost:3001/api/enhance",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data.upscaledImage);

      setEnhanceImg(res.data.upscaledImage);
      setLoading(false);
    } catch (err) {
      console.error("Enhance failed:", err.message);
      alert("Failed to enhance image.");
      setLoading(false);
    }

    setLoading(false);
  };

  // handle image
  const downloadImage = async () => {
    try {
      const response1 = await axios.post(
        "http://localhost:3001/api/hasActiveSubscription",
        { uid: userId }
      );

      console.log(response1);

      if (response1.data.active) {
        const filename = "enhanced-image.jpg";
        const response = await fetch(enhanceImg);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("no subscription");
        navigate("/pricing");
      }
    } catch (err) {
      console.error("Image download failed:", err.message);
      alert("Failed to download image.");
    }
  };

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
  return (
    <div className="home-page">
      <NavBar />
      {loading ? <Loader /> : null}
      <section className="hero">
        <div className="upload-img">
          <h2 className="heading1">Image Enhancer</h2>
          <p className="subheading">
            Upload Your Image to Enhance Its Quality Instantly
          </p>

          <form action="">
            <label htmlFor="img-upload" className="primary-btn">
              <input
                type="file"
                id="img-upload"
                accept=".png, .jpg, image/png, image/jpeg"
                onChange={handleImageUpload}
              />
              <img src={icons.upload} alt="" />
              <p className="p1">Upload Image</p>
            </label>
          </form>
        </div>

        {uploadedImg ? (
          <div className="result">
            {/* <button className="close">
              <img src={icons.close} alt="" />
            </button> */}
            <h2 className="heading1">Here the enhanced Result</h2>
            <p className="subheading">
              In order to download the image check our plans
            </p>

            <div className="img-grp">
              <div className="original-img">
                <h2>Original</h2>
                <div className="img-container">
                  {uploadedImg ? (
                    <img src={uploadedImg} alt="Uploaded" />
                  ) : (
                    <img src={img} alt="Default" />
                  )}
                </div>
              </div>
              <div className="original-img">
                <h2>Enhanced</h2>
                <div className="img-container">
                  {enhanceImg ? (
                    <img src={enhanceImg} alt="Enhanced" />
                  ) : (
                    <img src={img} alt="Default" />
                  )}
                </div>
              </div>
            </div>

            <div className="btn-grp">
              <button className="primary-btn" onClick={handleEnhanceImage}>
                <p className="p1">Enhance Image</p>
              </button>
              {enhanceImg ? (
                <button className="primary-btn" onClick={downloadImage}>
                  <p className="p1">Download Image</p>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>


      <Footer />
    </div>
  );
};

export default Home;
