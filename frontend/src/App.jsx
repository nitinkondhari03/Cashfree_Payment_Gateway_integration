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
      console.log(checkoutOptions);
      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          console.log(
            "User has closed the popup or there is some payment error, Check for Payment Status"
          );
          console.log(result.error);
        }
        if (result.redirect) {
          console.log("Payment will be redirected");
        }
        if (result.paymentDetails) {
          console.log("Payment has been completed, Check for Payment Status");
          console.log(result.paymentDetails.paymentMessage);
          console.log(result);
        }
        console.log(result);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handverify = async (event) => {
    event.preventDefault();
    let orderId="bebead51e22f";
    try {
      const dataResponse = await fetch("http://localhost:8080/verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const dataApi = await dataResponse.json();

      console.log(dataApi);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Cashfree Payment integration</h1>
      <div className="card">
        <button onClick={handclick}>Pay</button>
      </div>
      <button onClick={handverify}>Verify</button>
    </>
  );
}

export default App;
