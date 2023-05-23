var express = require("express");
var router = express.Router();
const { tesController, getDataWaterReal,getDataWaterEnc, postWaterEnc, actionConvertCSV, decryptData, postWaterReal } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.post("/encrypt",isLoginAdmin, postWaterEnc);
router.post("/real",isLoginAdmin, postWaterReal);


router.get("/encrypt/:id",isLoginAdmin, getDataWaterEnc);
router.get("/real",isLoginAdmin, getDataWaterReal);

// Testing
router.post("/tes", tesController);

router.get("/csv", actionConvertCSV);

module.exports = router;
 