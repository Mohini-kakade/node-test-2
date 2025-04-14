const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateUser } = require("../middlewares/validateUser");

router.post("/register", validateUser,register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
