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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
          <p>
            At Imagify, we are passionate about transforming images through
            advanced technology. Our mission is to make image enhancement easy,
            fast, and accessible to everyone.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
