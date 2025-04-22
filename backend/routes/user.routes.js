const router = require("express").Router();
const userController = require("../controllers/user.controller");
const validationMiddleware = require("../middleware/validationMiddleware.js");
const { check } = require("express-validator");


// middleware that is specific to this router
//shows time
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
router.post(
  "/login",
  [
    check("name")
      .isLength({
        min: 3,
      })
      .withMessage("Must be at least 3 characters long")
      .trim()
      .exists()
      .matches(/^[A-ZÕÄÖÜa-zõäöü]+$/)
      .withMessage("Must be alphabetic"),
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Email must be correctly formated"),
    check("password")
      .isLength({
        min: 4,
      })
      .withMessage("Must be at least 4 characters long"),
  ],
  validationMiddleware,
  userController.login
);

router.post(
  "/signup",
  [
    check("name")
      .isLength({
        min: 3,
      })
      .withMessage("Must be at least 3 characters long")
      .trim()
      .exists()
      .matches(/^[A-ZÕÄÖÜa-zõäöü]+$/)
      .withMessage("Must be alphabetic"),
    check("email").isEmail().normalizeEmail().withMessage("Must be an email"),
    check("password")
      .isLength({
        min: 4,
      })
      .withMessage("Must be at least 4 characters long"),
  ],
  validationMiddleware,
  userController.signup
);

router.get("/signup", userController.signup);

//router.post('/login', userController.login)

module.exports = router;