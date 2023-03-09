const mongoose = require("mongoose");

const controlSchema = mongoose.Schema({
  lamp1: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  lamp2: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  pump1: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  pump2: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  valve: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  blend: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
  },
  status: {
    type: String,
    enum: ["ON", "OFF"],
    default: "ON",
    require: true,
  },
},{ timestamps: true });

module.exports = mongoose.model("Control", controlSchema);
