const bcrypt = require("bcrypt");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require("../auth");
const { errorHandler } = auth;

//[SECTION] User registration
/*
    Steps:
    1. Create a new User object using the mongoose model and the information from the request body
    2. Make sure that the password is encrypted
    3. Save the new User to the database
*/
module.exports.registerUser = (req, res) => {
  // Checks if the email is in the right format
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ message: "Invalid email format" });
  }
  // Checks if the mobile number has the correct number of characters
  else if (req.body.mobileNo.length !== 11) {
    return res.status(400).send({ message: "Mobile number is invalid" });
  }
  // Checks if the password has atleast 8 characters
  else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password must be atleast 8 characters long" });
  } else if (
    typeof req.body.firstName !== "string" ||
    typeof req.body.lastName !== "string"
  ) {
    return res
      .status(400)
      .send({ message: "First name and last name must be strings" });

    // If all needed requirements are achieved
  } else {
    // Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
    // Uses the information from the request body to provide all the necessary information
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      // "10" is the number of salt rounds that the bcrypt algorithm will run to encrypt the password
      password: bcrypt.hashSync(req.body.password, 10),
      mobileNo: req.body.mobileNo,
    });

    // Saves the created object to our database
    // Then, return result to the handler function. No return keyword used because we're using arrow function's implicit return feature
    // catch the error and return to the handler function. No return keyword used because we're using arrow function's implicit return feature
    return newUser
      .save()
      .then((result) =>
        res.status(201).send({
          message: "User registered successfully",
          user: result,
        }),
      )
      .catch((err) => err);
  }
};

//[SECTION] User authentication
/*
    Steps:
    1. Check the database if the user email exists
    2. Compare the password provided in the login form with the password stored in the database
    3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    // Checks if the emails exists in the db
    // The "findOne" method returns the first record in the collection that matches the search criteria
    return User.findOne({ email: req.body.email })
      .then((result) => {
        // If user does not exist in the db
        if (result == null) {
          return res.status(404).send({ message: "No email found" });

          // If user exists
        } else {
          // compareSync() compares a non-encrypted password with the encrypted password from the db/result
          // returns a boolean true/false
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password,
          );

          if (isPasswordCorrect) {
            // Generate a token
            // Uses the "createAccessToken" method defined in the "auth.js" file
            return res.status(200).send({
              message: "User logged in successfully",
              access: auth.createAccessToken(result),
            });
          } else {
            return res
              .status(401)
              .send({ message: "Incorrect email or password" });
          }
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } else {
    return res.status(400).send({ message: "Invalid email format" });
  }
};

//[SECTION] Check if the email already exists
/*
    Steps: 
    1. Use mongoose "find" method to find duplicate emails
    2. Use the "then" method to send a response back to the client application based on the result of the "find" method
*/
module.exports.checkEmailExists = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.find({ email: req.body.email })
      .then((result) => {
        // The "find" method returns a record if a match is found
        if (result.length > 0) {
          return res.status(409).send({ message: "Duplicate email found" });

          // No duplicate email found
          // The user is not yet registered in the database
        } else {
          return res.status(404).send({ message: "Email not found" });
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } else {
    res.status(400).send({ message: "Invalid email format" });
  }
};

/*
    Steps:
    1. Retrieve the user document using its id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        // if user not found,
        return res.status(404).send({ message: "User not found" });
      } else {
        // if the user is found, return the user.
        user.password = "";
        return res.status(200).send(user);
      }

      user.password = "";
      res.status(200).send(user);
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.toAdmin = (req, res) => {
  let updateRole = {
    isAdmin: true,
  };
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    return User.findByIdAndUpdate(req.params.id, updateRole, { new: true })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(false);
      });
  } else {
    return res.status(401).send("You have no access to this page!");
  }
};

module.exports.toNonAdmin = (req, res) => {
  let updateRole = {
    isAdmin: false,
  };
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    return User.findByIdAndUpdate(req.params.id, updateRole, { new: true })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(false);
      });
  } else {
    return res.status(401).send("You have no access to this page!");
  }
};

// Enroll user
module.exports.enroll = (req, res) => {
  if (req.user.isAdmin) {
    // Admins should be not be allowed to enroll to a course
    return res.status(403).send({ message: "Admin is forbidden" });
  }

  // Creates a new enrollment
  let newEnrollment = new Enrollment({
    userId: req.user.id,
    enrolledCourses: req.body.enrolledCourses,
    totalPrice: req.body.totalPrice,
  });

  return newEnrollment
    .save()
    .then((enrolled) => {
      return res.status(201).send({
        success: true,
        message: "Enrolled successfully",
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

/*
    Steps:
    1. Use the mongoose method "find" to retrieve all enrollments of the logged in user
    2. If no enrollments are found, return a 404 error. Else return a 200 status and the enrollment record
*/
module.exports.getEnrollments = (req, res) => {
  return Enrollment.find({ userId: req.user.id })
    .populate("enrolledCourses.courseId")
    .then((enrollments) => {
      if (enrollments.length > 0) {
        return res.status(200).send(enrollments);
      }
      return res.status(404).send({
        message: "No enrolled courses",
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update the user profile
module.exports.updateProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo, email } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo, email },
      // to return the updated document
      { new: true },
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
