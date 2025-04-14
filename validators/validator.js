const { body, validationResult } = require("express-validator");

// Register validation rules
const registerValidationRules = () => {
    return [
        body("fullName").not().isEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
        body("currencyPreference").not().isEmpty().withMessage("Currency preference is required"),
    ];
};

// Login validation rules
const loginValidation = () => {
    return [
        body("email").isEmail().withMessage("Email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ];
};

// Validation handler to check for errors
const validateRegistration = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};

module.exports = { registerValidationRules, loginValidation, validateRegistration };
