const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    const { uname, email, password } = req.body;
    const data = {
      uname,
      email,
      password,
    };

    console.log(data);

    // Check if all required fields are provided
    if (!uname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email is already registered");

      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // Specify salt rounds (10 is the default recommended value)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object and save to the database
    const newUser = new User({ uname, email, password: hashedPassword });
    await newUser.save();

    // Send response
    console.log("User registered successfully");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error creating user:", err); // Log error for debugging
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

//! login MiddleWare
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing input fields
    if (!email || !password) {
      console.log("Missing email or password in the request body.");
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid user email.");
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password.");
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, uname: user.uname }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "24h" } // Expiration time
    );

    // Set the JWT token in a cookie
    res.cookie("accessToken", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: false, // Set to false for local development
      sameSite: "strict", // Protect against CSRF
    });

    console.log("Login successful");

    // Send a success response along with the token
    res.status(200).json({
      message: "Login successful",
      token, // Including the token in the response for convenience
      uid: user._id,
      uname: user.uname,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

const verifytoken = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
};

//! for logout and cleaning..
const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

//! middleware to check the authenticity of tokens weather it is correct
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // check if the token is provide via header from react
    if (!token) {
      return res
        .status(401)
        .json({ message: "access Denied: No token provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode; // attach user info to requesed object
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Invalid Token" });
  }
};

const checkForExistingEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Email is already registered");
      return res.status(409).json({ message: "Email already exists" }); // Use 409 Conflict
    }

    res.status(200).json({ message: "New email" });
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const checkForExistingEmailForForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Email is already registered");
      return res.status(201).json({ message: "Email already exists" }); // Use 409 Conflict
    }

    res.status(409).json({ message: "New email" });
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//! updating password
const updatePassword = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing input fields
  if (!email || !password) {
    console.log("Missing email or password in the request body.");
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid user email.");
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  signup,
  login,
  authenticate,
  verifytoken,
  logout,
  checkForExistingEmail,
  checkForExistingEmailForForgetPassword,
  updatePassword,
};
