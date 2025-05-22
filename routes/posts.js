const express = require("express");
const {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  getSinglePost,
} = require("../controllers/post.controller");
const router = express.Router();

const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const validate = require("../middleware/validate");
const postValidator = require("../Validators/postValidator");

//Only admin will have authority to create post
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  postValidator,
  validate,
  createPost
);

//Only admin will have authority to update post
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  postValidator,
  validate,
  updatePost
);

//Only admin will have authority to delete post
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deletePost);

//Admin and user both can get all post
router.get("/", authMiddleware, getAllPost);

//Admin and user both can get single post
router.get("/:id", authMiddleware, getSinglePost);

module.exports = router;
