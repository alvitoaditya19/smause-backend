const mongoose = require("mongoose");

let settingSchema = mongoose.Schema({
  nameVegetable: {
    type: String,
    require: [true, "Vegetable Harus Diisi"],
  },
  amountVegetable: {
    type: Number,
    require: [true, "Vegetable Harus Diisi"],
  },
  amountHarvest: {
    type: Number,
    require: [true, "Harvest Harus Diisi"],
  },
},{ timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);