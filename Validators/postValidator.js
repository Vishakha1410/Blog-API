const { body } = require("express-validator");

const postValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be 5 character long"),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 })
    .withMessage("Content must be minimun 20 characters long"),
];

module.exports = postValidator;
