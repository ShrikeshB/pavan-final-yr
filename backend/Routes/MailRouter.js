import express from "express";
import { sendVerificationEmail } from "../Controller/MailController.js";

const router = express.Router();

router.post("/sendMail", sendVerificationEmail);

export default router;
