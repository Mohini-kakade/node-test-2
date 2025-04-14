const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { validatePost } = require("../middlewares/validatePost");

const auth = require("../middlewares/authMiddleware");

router.post("/create", auth, validatePost,createPost);
router.get("/", auth, getPosts);
router.get("/:post_id", auth, getPostById);
router.put("/:post_id", auth, updatePost);
router.delete("/:post_id", auth, deletePost);

module.exports = router;
