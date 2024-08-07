import "./App.css";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useState } from "react";
function App() {
  let cashfree;
  var initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };
  initializeSDK();
  const [order, setOrderId] = useState("");
  const getSessionId = async () => {
    try {
      let res = await axios.get("http://localhost:8080/payment");
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {}
  };
  const handclick = async (event) => {
    event.preventDefault();
    try {
      let sessionId = await getSessionId();
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
          console.log(
            "User has closed the popup or there is some payment error, Check for Payment Status"
          );
          console.log(result.error);
        }
        if (result.redirect) {
          // This will be true when the payment redirection page couldnt be opened in the same window
          // This is an exceptional case only when the page is opened inside an inAppBrowser
          // In this case the customer will be redirected to return url once payment is completed
          console.log("Payment will be redirected");
        }
        if (result.paymentDetails) {
          // This will be called whenever the payment is completed irrespective of transaction status
          console.log("Payment has been completed, Check for Payment Status");
          console.log(result.paymentDetails.paymentMessage);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Cashfree Payment  integration</h1>
      <div className="card">
        <button onClick={handclick}>Pay</button>
      </div>
    </>
  );
}

export default App;
