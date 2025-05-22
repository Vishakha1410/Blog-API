const { body } = require("express-validator");

const commentValidator = [
  body("postId")
    .notEmpty()
    .withMessage("Post Id is not required")
    .isMongoId()
    .withMessage("Invalid Post Id format"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 5 })
    .withMessage("Content must be 5 characters long")
    .isLength({ max: 500 })
    .withMessage("Content cannot exceed 500 character"),
];

module.exports = commentValidator;
