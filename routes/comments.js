const express = require("express");
const {
  createComment,
  getComment,
  getSingleComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");
const { authMiddleware } = require("../middleware/auth");
const commentValidator = require("../Validators/commentValidator");
const validate = require("../middleware/validate");
const router = express.Router();

//for create
router.post("/", authMiddleware, commentValidator, validate, createComment);

//for getting all comment
router.get("/", authMiddleware, getComment);

//for getting single comment
router.get("/:id", authMiddleware, getSingleComment);

//for updating comment
router.put("/:id", authMiddleware, validate, commentValidator, updateComment);

//for deleting comment
router.delete("/:id", authMiddleware, deleteComment);
module.exports = router;
