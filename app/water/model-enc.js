const mongoose = require("mongoose");

let waterSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ketinggianAir: {
    type: String,
    require: [true, "ketinggianAir Harus Diisi"],
  },
  oksigen: {
    type: String,
    require: [true, "oksigen Harus Diisi"],
  },
  kekeruhanAir: {
    type: String,
    require: [true, "kekeruhanAir Harus Diisi"],
  },
},{ timestamps: true });

module.exports = mongoose.model("WaterEncrypt", waterSchema);
