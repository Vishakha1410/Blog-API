const Comment = require("../models/Comment");
const Post = require("../models/Post");

//create comment
const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ messasge: "Post not exist" });

    const comment = new Comment({
      postId,
      content,
      author_id: req.user._id,
    });

    await comment.save();

    res.status(201).json({ messasge: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get comments

const getComment = async (req, res) => {
  try {
    const comment = await Comment.find();
    if (comment.length === 0) {
      return res.status(404).json({ message: "No comment found" });
    }
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get single comment

const getSingleComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "comment not found" });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update comment

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    //only the author can update

    if (comment.author_id.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Unauthorize to update this comment" });

    comment.content = content;
    await comment.save();

    res.json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete comment

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    //only the author can delete

    if (comment.author_id.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Unauthorize to delete this comment" });

    await Comment.findByIdAndDelete(id);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createComment,
  getComment,
  getSingleComment,
  updateComment,
  deleteComment,
};
