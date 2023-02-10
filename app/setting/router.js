var express = require("express");
var router = express.Router();
const { actionEdit, getDataSetting, actionCreate, getDetailSetting, actionUp } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API

router.get("/up", actionUp);

router.post("/create", isLoginAdmin, actionCreate);
router.get("/",isLoginAdmin, getDataSetting);

router.get("/:id",isLoginAdmin, getDetailSetting);

router.put("/edit/:id",isLoginAdmin, actionEdit);
// router.put("/put", updateSuhu);

module.exports = router;
 