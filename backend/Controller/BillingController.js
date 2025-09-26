const billingModel = require("../Model/billingModel");

const billingHandler = async (req, res) => {
  try {
    const { uid, payment_id } = req.body;
    console.log("payment_id" + payment_id);

    const now = new Date();

    const subscription = await billingModel.findOne({
      uid,
      expireAt: { $gt: now },
    });

    if (subscription) {
      return res.status(200).json({ message: "plan exists" });
    }

    const purchasedAt = new Date();
    const expireAt = new Date();
    expireAt.setMonth(expireAt.getMonth() + 1);

    const billing = new billingModel({
      uid,
      payment_id,
      purchasedAt,
      expireAt,
    });

    await billing.save();
    res.status(201).json({ message: "Billing created successfully", billing });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({ error: err.message });
  }
};

const hasActiveSubscription = async (req, res) => {
  try {
    const { uid } = req.body;
    console.log("uid = " + uid);

    const now = new Date();

    const subscription = await billingModel.findOne({
      uid,
      expireAt: { $gt: now },
    });

    if (subscription) {
      return res.status(200).json({ active: true });
    } else {
      return res.status(200).json({ active: false });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getSubscriptionDetails = async (req, res) => {
  try {
    const { uid } = req.body;

    const subscription = await billingModel
      .findOne({ uid })
      .sort({ purchasedAt: -1 });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found." });
    }

    return res.status(200).json({ subscription });
  } catch (error) {
    console.log(error.message);

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  billingHandler,
  hasActiveSubscription,
  getSubscriptionDetails,
};
