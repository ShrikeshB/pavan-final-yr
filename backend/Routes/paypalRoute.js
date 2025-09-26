import got from "got";
import express from "express";
const router = express.Router();

const getAccessToken = async () => {
  try {
    const response = await got.post(
      `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`,
      {
        form: {
          grant_type: "client_credentials",
        },
        username: process.env.PAYPAL_CLIENTID,
        password: process.env.PAYPAL_SECRET,
      }
    );
    const data = JSON.parse(response.body);
    const newAccessToken = data.access_token;

    return newAccessToken;
  } catch (err) {
    console.log(err.message);
    throw new Error(err);
  }
};

const createOrder = async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const response = await got.post(
      `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        json: {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "50.00",
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: "50.00",
                  },
                },
              },
              payee: {
                email_address: "sb-6rhyj40339328@business.example.com", // 👈 use your sandbox business email
              },
              items: [
                {
                  name: "Volatility Grid",
                  description: "some description",
                  unit_amount: {
                    currency_code: "USD",
                    value: "50.00",
                  },
                  quantity: "1",
                },
              ],
            },
          ],
        },
        responseType: "json",
      }
    );

    console.log(response.body);
    const order_id = response.body?.id;

    return res.status(200).json({ order_id });
  } catch (err) {
    // More detailed error logging
    if (err.response && err.response.body) {
      console.error("PayPal API error response:", err.response.body);
      return res.status(err.response.statusCode || 500).json({
        error: err.response.body,
      });
    } else {
      console.error("Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }
};

router.post("/createOrder", createOrder);

export default router;
