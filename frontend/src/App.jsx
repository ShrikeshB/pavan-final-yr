import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/login";
import Home from "./pages/home/Home";
import Pricing from "./pages/pricing/Pricing";
import ContactForm from "./pages/contact/Contact";
import AboutUs from "./pages/aboutUs/AboutUs";
import HowToUse from "./pages/howToUse/HowToUse";
import SubscriptionDetails from "./pages/subscriptionDetails/SubscriptionDetails";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/howToUse" element={<HowToUse />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/subscriptionDetails" element={<SubscriptionDetails />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
