const Transaction = require("../models/Transaction");


// CREATE Transaction
exports.createTransaction = async (req, res) => {
  
  try {
    
     const data=req.body
    const transaction = await Transaction.create({
      ...data,
      createdBy: req.user?._id, // যদি auth থাকে
    });
   console.log(transaction)
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
exports.getMyTransactions = async (req, res) => {
  try {
    let transactions;

    // Admin → সব transaction
    if (req.user.role === "admin") {
      transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email role");
    }
    // Normal User → নিজের transaction
    else {
      transactions = await Transaction.find({
        createdBy: req.user._id,
      })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email role");
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params; // /api/v1/transaction/:id
    const updates = req.body;

    // Find the transaction
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // User-specific check (if not admin, only allow owner to update)
    if (req.user.role !== "admin" && transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this transaction" });
    }

    // Update all provided fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== "" && updates[key] !== undefined) {
        transaction[key] = updates[key];
      }
    });
    // Recalculate due if totalFee or paid changed
    if (updates.totalFee !== undefined || updates.paid !== undefined) {
      const total = Number(transaction.totalFee || 0);
      const paid = Number(transaction.paid || 0);
      transaction.due = Math.max(total - paid, 0);
    }

    await transaction.save();

    res.json({ message: "Transaction updated successfully", transaction });
  } catch (err) {
    console.error("Update transaction error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    // Find transaction
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    // Delete transaction
    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: error.message });
  }
};
