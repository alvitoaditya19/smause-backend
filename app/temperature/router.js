var express = require("express");
var router = express.Router();
const {postTemp, getDataTempEnc,getDataTempReal, postTempReal,postTempEnc, actionConvertCSV,  } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.post("/", isLoginAdmin,postTemp);

router.get("/encrypt",isLoginAdmin, getDataTempEnc);
router.get("/real",isLoginAdmin, getDataTempReal);

router.post("/encrypt",isLoginAdmin, postTempEnc);
router.post("/real",isLoginAdmin, postTempReal);


router.get("/csv", actionConvertCSV);
// router.put("/put", updateSuhu);

module.exports = router;
 