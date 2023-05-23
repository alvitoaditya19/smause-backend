const mongoose = require("mongoose");

let temperatureSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  humidity: {
    type: String,
    require: [true, "Humidity Harus Diisi"],
    
  },
  celcius: {
    type: String,
    require: [true, "Suhu Celcius Harus Diisi"],
  },
},{ timestamps: true });

module.exports = mongoose.model("TemperatureEncrypt", temperatureSchema);
