const { body, validationResult } = require("express-validator");

exports.validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name should not exceed 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@, $, !, %, etc.)"
    ),

  body("phone")
    .trim()
    .isMobilePhone("en-IN")
    .withMessage("Please enter a valid Indian phone number"),

  body("address").trim().notEmpty().withMessage("Address is required"),

  body("role")
    .trim()
    .isIn(["admin", "user"])
    .withMessage("Role must be either 'admin' or 'user'"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
