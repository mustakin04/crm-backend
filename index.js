require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const route = require("./src/router/index");

const app = express();

/* ===============================
   ALLOWED ORIGINS
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://crm.iatlasstudy.com",
  "https://sensational-kheer-8f473b.netlify.app",
];

/* ===============================
   CORS CONFIG (FIXED)
================================ */
const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server or curl/postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false); // IMPORTANT: no crash
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/* ===============================
   HANDLE PRE-FLIGHT REQUESTS
================================ */
app.options("*", cors(corsOptions));

/* ===============================
   BODY PARSER
================================ */
app.use(express.json());

/* ===============================
   DB
================================ */
connectDB();

/* ===============================
   ROUTES
================================ */
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