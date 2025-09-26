import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dataminds60@gmail.com",
    pass: "dpxuybqxymunawsu",
  },
  debug: true,
});

export const sendVerificationEmail = async (req, res) => {
  console.log("sending...");
  console.log("sending mail = "+process.env.NODE_PASSWORD);
  const { generatedCode, email } = req.body;
  console.log({ generatedCode, email });

  try {
    await transporter.sendMail({
      from: "dataminds60@gmail.com",
      to: email,
      subject: "DataMinds - Verify Your Email Address",
      text: `DataMinds signup using OTP. Your OTP is: ${generatedCode}`,
      html: `<p>DataMinds signup using OTP. Your OTP is: ${generatedCode}</p>`,
    });

    console.log("Email sent successfully");
    res.status(200).json({ message: "Mail has been sent!" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Failed to send mail!" });
  }
};

export const test = async (req, res) => {
  const { generatedCode, email } = req.body;
  console.log({ generatedCode, email });

  console.log("hello");

  res.status(200).json({ message: "hello" });
};
