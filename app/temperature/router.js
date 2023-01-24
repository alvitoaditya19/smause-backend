var express = require("express");
var router = express.Router();
const { getTemp, postSuhu, actionConvertCSV, iseng } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API
router.get("/",isLoginAdmin, getTemp);
router.post("/post", postSuhu);
router.get("/csv", actionConvertCSV);
// router.put("/put", updateSuhu);

module.exports = router;
 