const express = require("express");
const protect = require("../../middlewares/auth.middleware");
const { createTransaction, getMyTransactions, updateTransaction, deleteTransaction } = require("../../controller/transactionController");
const router = express.Router();


router.post("/createTransaction", protect, createTransaction);
router.get("/getTransactions", protect, getMyTransactions);
router.put("/updateTransaction/:id", protect, updateTransaction);
router.delete("/deleteTransaction/:id", protect, deleteTransaction);

module.exports = router;
