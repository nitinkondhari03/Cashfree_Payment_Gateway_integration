const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Cashfree } = require("cashfree-pg");
const { error } = require("console");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generatOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");

  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);

  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
}
app.get("/", (req, res) => {
  res.send("Hellow World!");
});

app.get("/payment", async (req, res) => {
  try {
    let request = {
      "order_amount": 1.0,
      "order_currency": "INR",
      "order_id": await generatOrderId(),
      "customer_details": {
        "customer_id": "nitin193949",
        "customer_phone": "9999999999",
        "customer_name": "nitin",
        "customer_email": "nitinkondhari85@gmail.com",
      },
    };
    Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
     console.log(response.data);
      res.json(response.data)
    }).catch(error=>{
      console.log(error.response.data.message)
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/verify", (req, res) => {
      try {
            let {orderId}=req.body;
            Cashfree.PGOrderFetchPayments("2023-08-01",orderId).then((response)=>{
              res.json(response.data)
            }).catch((error)=>{
                  console.log(error)
            })
      } catch (error) {
           console.log(error) 
      }
});
app.listen(8080, () => {
  console.log("Server run posrt at 8080");
});
