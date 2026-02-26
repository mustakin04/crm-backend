require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const route = require("./src/router/index");

const app = express();

/* ===============================
   CORS CONFIG (NODE 24 SAFE)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://crm.iatlasstudy.com",  //frontedn
  "https://sensational-kheer-8f473b.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   BODY PARSER
================================ */
app.use(express.json());

/* ===============================
   DATABASE
================================ */
connectDB();

  
app.use(route);


app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
