const Post = require("../models/postModel");

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      createdBy: req.user.id,
      isDeleted: false,
      isUpdated: false,
    });

    await newPost.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("new_post", newPost);
    }

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message || err });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message || err });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      post_id: req.params.post_id,
      isDeleted: false,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or has been deleted." });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res
      .status(500)
      .json({ message: "Error fetching post", error: err.message || err });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      post_id: req.params.post_id,
      isDeleted: false,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or has been deleted." });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post." });
    }

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.description !== undefined)
      post.description = req.body.description;
    if (req.body.content !== undefined) post.content = req.body.content;

    post.isUpdated = true;
    await post.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("post_updated", post);
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message || err });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ post_id: req.params.post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.isDeleted) {
      return res.status(400).json({ message: "Post is already deleted." });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    post.isDeleted = true;
    await post.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("post_deleted", { post_id: req.params.post_id });
    }

    res.status(200).json({ message: "Post marked as deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res
      .status(500)
      .json({ message: "Error deleting post", error: err.message || err });
  }
};
