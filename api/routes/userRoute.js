const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.list);
router.get("/get/:id", userController.get);
router.get("/getByNickname/:nickname", userController.getByNickname);
router.post("/", userController.create);

module.exports = router;