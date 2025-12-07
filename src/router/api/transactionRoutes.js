const express = require("express");
const protect = require("../../middlewares/auth.middleware");
const { createTransaction, getTransactions } = require("../../controller/transactionController");
const router = express.Router();


router.post("/createTransaction", protect, createTransaction);
router.get("/getTransactions", protect, getTransactions);
// router.get("/transaction/:id", auth, getTransactionById);
// router.delete("/transaction/:id", auth, deleteTransaction);

module.exports = router;
