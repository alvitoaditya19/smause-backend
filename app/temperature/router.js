var express = require("express");
var router = express.Router();
const {postTemp, getDataTempEnc,getDataTempReal, postTempReal,postTempEnc, actionConvertCSV, getAllDataTempEnc,  } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.post("/", isLoginAdmin,postTemp);

router.get("/encrypt/:id",isLoginAdmin, getDataTempEnc);
router.get("/all",isLoginAdmin, getAllDataTempEnc);

router.get("/real",isLoginAdmin, getDataTempReal);

router.post("/encrypt",isLoginAdmin, postTempEnc);
router.post("/real",isLoginAdmin, postTempReal);


router.get("/csv", actionConvertCSV);
// router.put("/put", updateSuhu);

module.exports = router;
 