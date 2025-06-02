const express = require("express");
const UserController = require("../controllers/users/UserController");
const AuthController = require("../controllers/users/AuthController");
const router = express.Router();

router.route("/signup").post(UserController.signUpUser);
router.route("/profile/details").get(UserController.getUserDetails);
router.route("/logout").post(AuthController.logout);
router.route("/login").post(AuthController.accountLogin);

module.exports = router;
