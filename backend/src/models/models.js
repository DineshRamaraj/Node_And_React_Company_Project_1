const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

User = mongoose.model("User", userSchema);

const todoSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

Todo = mongoose.model("Todo", todoSchema);

module.exports = { User, Todo };
