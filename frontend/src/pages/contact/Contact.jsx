import React, { useState } from "react";
import "./ContactForm.scss";
import NavBar from "../../component/navbar/NavBar";
import Footer from "../../component/footer/Footer";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submit logic here (e.g., API call)
  };

  return (
    <div>
      <NavBar />
      <div className="contact">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Contact Us</h2>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ContactForm;
