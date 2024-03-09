const { validationResult, check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

//User sign up validation
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
      .exists({checkFalsy: true})
      .withMessage('Please provide your first name.'),
  check('lastName')
      .exists({checkFalsy: true})
      .withMessage('Please provide your last name.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

//Spot creation validation
const validateSpot = [
  check('address')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid address'),
  check('city')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid city'),
  check('state')
      .exists({ checkFalsy: true })
      .isLength({ min: 2, max: 2 })
      .withMessage('Please provide a valid state using their abbreviation'),
  check('country')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid country'),
  check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 40 })
      .withMessage('Please provide the spot with a valid name within the 40 character maximum'),
  check('description')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid description for the spot'),
  check('price')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a valid price'),
  handleValidationErrors
]
// Log in validation
const validateLogin = [
  check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
  handleValidationErrors
];

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .notEmpty()
    .isLength({min: 25})
    .withMessage('Please provide a review that is 25 characters at minimum.'),
  check('stars')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('Please provide a value of 1 - 5'),
  handleValidationErrors
]

const validateBooking = [
  check('startDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isDate()
    .withMessage('Please provide a valid date.'),
    check('endDate')
    .exists({checkFalsy: true})
    .notEmpty()
    .isDate()
    .withMessage('Please provide a valid date.')
]

module.exports = {
  handleValidationErrors,
  validateSignup,
  validateSpot,
  validateLogin,
  validateReview,
  validateBooking
};
