var express = require("express");
var router = express.Router();
const {postTempReal,postTempEnc, actionConvertCSV, getDataSoilEnc, getDataSoilReal, postSoil, getAllDataSoilEnc,  } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.post("/", isLoginAdmin,postSoil);

router.get("/encrypt/:id",isLoginAdmin, getDataSoilEnc);
router.get("/all",isLoginAdmin, getAllDataSoilEnc);

router.get("/real", isLoginAdmin,getDataSoilReal);

router.post("/encrypt",isLoginAdmin, postTempEnc);
router.post("/real", isLoginAdmin,postTempReal);


router.get("/csv", actionConvertCSV);
// router.put("/put", updateSuhu);

module.exports = router;
 