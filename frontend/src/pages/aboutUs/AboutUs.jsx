import React from "react";
import "./AboutUs.scss";
import NavBar from "../../component/navbar/NavBar";
import Footer from "../../component/footer/Footer";

const AboutUs = () => {
  return (
    <>
      <NavBar />

      <section className="about-us">
        <div className="container">
          <h1>About Imagify</h1>
     <p>
  Imagify is an AI-powered image enhancement platform built to breathe new life
  into your photos. Whether your pictures are blurry, pixelated or low-resolution,
  our advanced algorithms upscale and enhance them instantly — improving clarity,
  sharpness, and detail while keeping colors natural.
</p>
<p>
  We started Imagify with a simple idea: high-quality visuals should be accessible
  to everyone, not just professionals with expensive tools. By combining
  cutting-edge machine learning with an easy-to-use interface, we empower
  individuals, businesses, and creatives to turn low-quality images into
  stunning, high-resolution results in just a few clicks.
</p>
<p>
  From social media posts to marketing materials, Imagify helps you showcase your
  best visuals without compromise — fast, reliable and privacy-friendly.
</p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
