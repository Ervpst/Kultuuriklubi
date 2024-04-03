const { Schema, model } = require("mongoose");

//creating user schema for database
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["pending", "active"], default: "pending" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;