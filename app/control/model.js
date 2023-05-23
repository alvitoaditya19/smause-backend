const mongoose = require("mongoose");

const controlSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lamp1: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
  lamp2: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
  pump1: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
  pump2: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
  valve: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
  blend: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
  statusControl: {
    type: String,
    enum: {
      values: ["ON", "OFF"],
      message: 'Status is required.'
    },
    default: "ON",
  },
}, { timestamps: true });

module.exports = mongoose.model("Control", controlSchema);
