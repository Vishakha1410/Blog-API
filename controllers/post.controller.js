const Post = require("../models/Post");

//create post(Admin only)

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author_id: req.user._id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get all post
const getAllPost = async (req, res) => {
  try {
    const post = await Post.find();
    if (post.length === 0) {
      return res.status(404).json({ message: "No post found" });
    }
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get single post
const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update post(admim only)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(202).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
};
