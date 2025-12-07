const Transaction = require("../models/Transaction");


// CREATE Transaction
exports.createTransaction = async (req, res) => {
  try {
    const data = req.body;

    const transaction = await Transaction.create({
      ...data,
      createdBy: req.user?._id, // যদি auth থাকে
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully!",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET All Transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    const count= await Transaction.countDocuments()
    res.status(200).json({
      success: true,
      data: transactions,
      count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Single Transaction
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
