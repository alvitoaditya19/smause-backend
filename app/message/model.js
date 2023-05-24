const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nilai: {
    type: String,
    require: [true, "Humidity Harus Diisi"],
    
  },
  message: {
    type: String,
    require: [true, "Suhu Celcius Harus Diisi"],
  },
},{ timestamps: true });

module.exports = mongoose.model("Messages", messageSchema);
