const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/chatController");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, chatWithAI);

module.exports = router;
