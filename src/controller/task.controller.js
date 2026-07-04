const Task = require("../models/task/task.model");

// Create Task
const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      assignedBy: req.user._id,
    };

    const task = await Task.create(taskData);

    task.activityLogs.push({
      user: req.user._id,
      action: "Task created",
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    const result = await Task.find()
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Task
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    task.activityLogs.push({
      user: req.user._id,
      action: "Task updated",
    });
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.activityLogs.push({
      user: req.user._id,
      action: "Task deleted",
    });

    await task.save();

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({
      assignedTo: userId,
    })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = status;
    task.activityLogs.push({
      user: req.user._id,
      action: `Status changed to ${status}`,
    });

    // Overdue Logic
    if (status === "Done") {
      task.isOverdue = false;
    } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
      task.isOverdue = true;
    }

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// add comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.comments.push({
      user: req.user._id,
      comment,
    });

    task.activityLogs.push({
      user: req.user._id,
      action: `Added comment: ${comment}`,
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get comments
const getComments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "comments.user",
      "name email",
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// get activityLogs
const getActivityLogs = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "activityLogs.user",
      "name email",
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task.activityLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// getDasboardStats 
const getDashboardStats = async (
  req,
  res
) => {
  try {
    const totalTasks =
      await Task.countDocuments();

    const pendingTasks =
      await Task.countDocuments({
        status: "Pending",
      });

    const inProgressTasks =
      await Task.countDocuments({
        status: "In Progress",
      });

    const doneTasks =
      await Task.countDocuments({
        status: "Done",
      });

    const overdueTasks =
      await Task.countDocuments({
        isOverdue: true,
      });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        doneTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
const getPerformanceReport = async (
  req,
  res
) => {
  try {
    const report =
      await Task.aggregate([
        {
          $group: {
            _id: "$assignedTo",

            assignedTasks: {
              $sum: 1,
            },

            completedTasks: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Done",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            pendingTasks: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Pending",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            inProgressTasks: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "In Progress",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "employee",
          },
        },

        {
          $unwind: "$employee",
        },

        {
          $project: {
            _id: 0,

            employeeId:
              "$employee._id",

            name:
              "$employee.name",

            email:
              "$employee.email",

            assignedTasks: 1,

            completedTasks: 1,

            pendingTasks: 1,

            inProgressTasks: 1,

            completionRate: {
              $multiply: [
                {
                  $divide: [
                    "$completedTasks",
                    "$assignedTasks",
                  ],
                },
                100,
              ],
            },
          },
        },

        {
          $sort: {
            completionRate: -1,
          },
        },
      ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
const getAllActivityLogs = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("activityLogs.user", "name email")
      .select("title activityLogs");

    let logs = [];

    tasks.forEach((task) => {
      task.activityLogs.forEach((log) => {
        logs.push({
          taskId: task._id,
          taskTitle: task.title,
          user: log.user,
          action: log.action,
          createdAt: log.createdAt,
        });
      });
    });

    logs.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTaskHistory = async (
  req,
  res
) => {
  try {
    const tasks =
      await Task.find({
        assignedTo: req.user._id,
      })
        .populate(
          "assignedBy",
          "name email"
        )
        .populate(
          "assignedTo",
          "name email"
        )
        .sort({
          updatedAt: -1,
        });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
     console.log(error);
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
  getMyTasks,
  updateTaskStatus,
  addComment,
  getComments,
  getActivityLogs,
  getDashboardStats,
  getPerformanceReport,
  getAllActivityLogs,
  getTaskHistory
};
