var express = require("express");
var router = express.Router();
const { actionCreate, signin, getUser, actionEdit, actionDelete, detailUser } = require("./controller");
const multer = require("multer");
const { isLoginAdmin, } = require("../middleware/auth");

const os = require("os");

router.post("/signin", signin);

router.post("/create", isLoginAdmin, multer({ dest: os.tmpdir() }).single("avatar"), actionCreate);
router.put(
  "/edit/:id",
  isLoginAdmin,
  multer({ dest: os.tmpdir() }).single("avatar"),
  actionEdit
);

router.get("/", isLoginAdmin, getUser);
router.get("/:id", isLoginAdmin, detailUser);
router.delete("/delete/:id", isLoginAdmin, actionDelete);

module.exports = router;
