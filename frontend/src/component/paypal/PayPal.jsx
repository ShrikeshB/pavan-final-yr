import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
export default function PayPal() {
  const initialOptions = {
    clientId:
      "ASohP-52Fn-sOGEQ-KkfxNDBc4C-8h_n5XbUqEaUP8Pwub9_br4Ny3dMeBtO1Ogf1hQLu-bn3Zy9_0ND",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
  };

  const onCreateOrder = async () => {
    const response = await fetch("/paypal/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.order_id; // ✅ This now works correctly
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log("Payment approved: ", details);
      // Add your success logic here (e.g., update order status, show success message)
    } catch (error) {
      console.error("Payment capture error: ", error);
    }
  };

  const onError = (err) => {
    console.log("paypal error", err);
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={styles}
        createOrder={onCreateOrder}
        onApprove={onApprove}
        onError={onError}
        // fundingSource="paypal"
      />
    </PayPalScriptProvider>
  );
}
