const express = require("express");
const passport = require("passport");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

// Route for duplicate email
router.post("/check-email", userController.checkEmailExists);

// Route for user registration
router.post("/register", userController.registerUser);

// Route for user authentication
router.post("/login", userController.loginUser);

// Route for retrieving user details
router.get("/details", verify, userController.getProfile);

router.patch("/update-admin/:id", verify, userController.toAdmin);

router.patch("/non-admin/:id", verify, userController.toNonAdmin);

// Route to enroll a user to a couse
router.post("/enroll", verify, userController.enroll);

// Route to get the user's enrollements array
router.get("/get-enrollments", verify, userController.getEnrollments);

// POST route for resetting the password
router.post("/reset-password", verify, userController.resetPassword);

// Update user profile route
router.put("/profile", verify, userController.updateProfile);

module.exports = router;
