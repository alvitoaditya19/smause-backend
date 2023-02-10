const mongoose = require("mongoose");

let waterSchema = mongoose.Schema({
  ketinggianAir: {
    type: String,
    require: [true, "Humidity Harus Diisi"],
  },
  oksigen: {
    type: String,
    require: [true, "Suhu Celcius Harus Diisi"],
  },
},{ timestamps: true });

module.exports = mongoose.model("WaterEncrypt", waterSchema);
