var express = require("express");
var router = express.Router();
const { getDataWaterReal,getDataWaterEnc, postWater, actionConvertCSV, decryptData } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.get("/encrypt",isLoginAdmin, getDataWaterEnc);
router.get("/real",isLoginAdmin, getDataWaterReal);





// Testing
router.post("/post", postWater);
router.post("/postt", decryptData);

router.get("/csv", actionConvertCSV);

module.exports = router;
 