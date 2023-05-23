var express = require("express");
var router = express.Router();

const multer = require("multer");
const { isLoginAdmin,isLoginUser } = require("../middleware/auth");

const os = require("os");
const { actionStatusControl, getStatusControl } = require("./controller");

router.get("/:id",isLoginAdmin, getStatusControl);
router.put("/:id",isLoginAdmin, actionStatusControl);


module.exports = router;
