const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is requied")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 character"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male,female and other"),

  body("role")
    .notEmpty()
    .withMessage("Role is reqired")
    .isIn(["user", "admin"])
    .withMessage("Role must be user or admin"),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),
];

const forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
];

const recoverPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("code").notEmpty().withMessage("reset code is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 character long"),
];

const sendVerificationCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
];

const verifyEmailCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("code")
    .notEmpty()
    .withMessage("Verification code is required")
    .isLength({ min: 6 })
    .withMessage("Code must be at least 6 characters"),
];

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  sendVerificationCodeValidator,
  verifyEmailCodeValidator,
};
