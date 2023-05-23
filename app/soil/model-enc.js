const mongoose = require("mongoose");

let soilSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // kelembapanTanah: {
  //   type: String,
  //   require: [true, "Kelembapan Tanah Harus Diisi"],
  // },
  phTanah: {
    type: String,
    require: [true, "PH Tanah Harus Diisi"],
  },
},{ timestamps: true });

module.exports = mongoose.model("SoilEncrypt", soilSchema);
