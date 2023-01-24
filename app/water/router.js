var express = require("express");
var router = express.Router();
const { getTemp, postSuhu, actionConvertCSV, decryptData } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.get("/",isLoginAdmin, getTemp);
router.post("/post", postSuhu);
router.post("/postt", decryptData);

router.get("/csv", actionConvertCSV);

module.exports = router;
 