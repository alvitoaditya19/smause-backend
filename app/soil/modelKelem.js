const mongoose = require("mongoose");

let soilSchema = mongoose.Schema({
  kelembapanTanah: {
    type: String,
    require: [true, "Kelembapan Tanah Harus Diisi"],
  },
  // phTanah: {
  //   type: String,
  //   require: [true, "PH Tanah Harus Diisi"],
  // },
},{ timestamps: true });

module.exports = mongoose.model("SoilKelem", soilSchema);
