import React from "react";
import "./HowToUse.scss";
import NavBar from "../../component/navbar/NavBar";
import Footer from "../../component/footer/Footer";

export default function HowToUse() {
  return (
    <>
      <NavBar />

      <section className="how-to-use">
        <div className="container">
          <h1>How to Use Imagify</h1>
          <p>Follow these simple steps to enhance your images with Imagify:</p>
          <ol>
            <li>
              <strong>Upload Your Image:</strong> Click the "Upload" button and
              select the low-quality image you want to enhance.
            </li>
            <li>
              <strong>Choose Enhancement Settings:</strong> Select the upscale
              factor (e.g., 2x) and output format (JPG or PNG) according to your
              preference.
            </li>
            <li>
              <strong>Enhance the Image:</strong> Click the "Enhance" button and
              let Imagify process your image using advanced AI algorithms.
            </li>
            <li>
              <strong>Preview & Download:</strong> Once the enhancement is complete,
              preview the improved image and download it to your device.
            </li>
            <li>
              <strong>Optional Sharing:</strong> Share your enhanced images on
              social media or use them for personal and professional projects.
            </li>
          </ol>
          <p>
            With Imagify, turning low-resolution images into crisp, high-quality
            visuals is fast, simple, and accessible to everyone.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
