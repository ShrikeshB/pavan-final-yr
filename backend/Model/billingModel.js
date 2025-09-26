// models/User.js
const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  payment_id: { type: String, required: true },
  purchasedAt: { type: Date, required: true, unique: true },
  expireAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Billings", billingSchema);
