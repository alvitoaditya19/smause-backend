var express = require("express");
var router = express.Router();
const { actionEdit, getDataSetting, actionCreate, getDetailSetting, actionUp,actionDelete, getAllDataSetting } = require("./controller");
const { isLoginAdmin } = require('../middleware/auth');
const multer = require("multer");
const os = require("os");

// API

router.get("/up", actionUp);
router.get("/all",isLoginAdmin, getAllDataSetting);

router.post("/create", isLoginAdmin, actionCreate);
router.get("/:userId",isLoginAdmin, getDataSetting);


router.get("/:userId/:id",isLoginAdmin, getDetailSetting);

router.put("/edit/:userId/:id",isLoginAdmin, actionEdit);
router.delete("/delete/:id", isLoginAdmin, actionDelete);

// router.put("/put", updateSuhu);

module.exports = router;
 