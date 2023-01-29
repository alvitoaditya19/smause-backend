var express = require("express");
var router = express.Router();

const multer = require("multer");
const { isLoginAdmin,isLoginUser } = require("../middleware/auth");

const os = require("os");
const { actionStatusControl, getStatusControl } = require("./controller");

router.get("/",isLoginAdmin, getStatusControl);
router.put("/",isLoginAdmin, actionStatusControl);


module.exports = router;
