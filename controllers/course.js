//[SECTION] Activity: Dependencies and Modules
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const { errorHandler } = require("../auth");

//[SECTION] Create a course
/*
    Steps: 
    1. Instantiate a new object using the Course model and the request body data
    2. Save the record in the database using the mongoose method "save"
    3. Use the "then" method to send a response back to the client appliction based on the result of the "save" method
*/
module.exports.addCourse = (req, res) => {
  // Creates a variable "newCourse" and instantiates a new "Course" object using the mongoose model
  // Uses the information from the request body to provide all the necessary information
  let newCourse = new Course({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    schedule: req.body.schedule,
  });

  Course.findOne({ name: req.body.name })
    .then((existingCourse) => {
      if (existingCourse) {
        return res.status(409).send({ message: "Course already exists" });
      } else {
        // If no duplicate, save the created object to our database
        return newCourse
          .save()
          .then((result) =>
            res.status(201).send({
              success: true,
              message: "Course added successfully",
              result: result,
            }),
          )
          .catch((err) => errorHandler(err, req, res));
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Activity: Retrieve all courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllCourses = (req, res) => {
  return Course.find({})
    .then((result) => {
      // if the result is not null send status 200 and its result
      if (result.length > 0) {
        return res.status(200).send(result);
      } else {
        // 404 for not found courses
        return res.status(404).send({ message: "No courses found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Retrieve all active courses
/*
    Steps: 
    1. Retrieve all courses using the mongoose "find" method with the "isActive" field values equal to "true"
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getAllActive = (req, res) => {
  Course.find({ isActive: true })
    .then((result) => {
      // if the result is not null
      if (result.length > 0) {
        res.status(200).send(result);

        // if no results are found
      } else {
        return res.status(404).send({ message: "No active courses found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Retrieve a specific course
/*
    Steps: 
    1. Retrieve a course using the mongoose "findById" method
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
module.exports.getCourse = (req, res) => {
  // req.params.id - "id" is supplied in the URL
  // "id" should be the same as the placeholder used in the route
  Course.findById(req.params.id)
    .then((course) => {
      if (course) {
        return res.status(200).send(course);
      } else {
        return res.status(404).send({ message: "Course not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Update a course
/*
    Steps: 
    1. Create an object containing the data from the request body
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. Use the "then" method to send a response back to the client application based on the result of the "find" method
*/
module.exports.updateCourse = (req, res) => {
  let updatedCourse = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  // findByIdandUpdate() finds the the document in the db and updates it automatically
  // req.body is used to retrieve data from the request body, commonly through form submission
  // req.params is used to retrieve data from the request parameters or the url
  // req.params.courseId - the id used as the reference to find the document in the db retrieved from the url
  // updatedCourse - the updates to be made in the document
  return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
    .then((course) => {
      if (course) {
        res.status(200).send({
          success: true,
          message: "Course updated successfully",
        });
      } else {
        res.status(404).send({ message: "Course not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Archive a course
/*
    Steps: 
    1. Create an object and with the keys to be updated in the record
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. If a course is updated send a response of "true" else send "false"
    4. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method
*/
module.exports.archiveCourse = (req, res) => {
  let updateActiveField = {
    isActive: false,
  };

  return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then((course) => {
      if (course) {
        // If course found, check if it was already archived
        if (!course.isActive) {
          // If course already archived, return a 200 status with a message indicating "Course already archived".
          return res.status(200).send({
            message: "Course already archived",
            course: course,
          });
        }
        //if the course is successfully archived, return true and send a message 'Course archived successfully'.
        res.status(200).send({
          success: true,
          message: "Course archived successfully",
        });
      } else {
        //if the course is not found, return 'Course not found'
        res.status(404).send({ message: "Course not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Activate a course
/*
    Steps: 
    1. Create an object and with the keys to be updated in the record
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. If the user is an admin, update a course else send a response of "false"
    4. If a course is updated send a response of "true" else send "false"
    5. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method
*/
module.exports.activateCourse = (req, res) => {
  let updateActiveField = {
    isActive: true,
  };

  return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then((course) => {
      if (course) {
        // If course is found, check if it is already activated
        if (course.isActive) {
          // if the course isActive is already true, send a message 'Course already activated', and return the course.
          return res.status(200).send({
            message: "Course already activated",
            course: course,
          });
        }
        // If course not yet activated, return a 200 status with a boolean true.
        res.status(200).send({
          success: true,
          message: "Course activated successfully",
        });
      } else {
        res.status(404).send(false);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller action to search for courses by course name
module.exports.searchCoursesByName = async (req, res) => {
  try {
    const { courseName } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const courses = await Course.find({
      name: { $regex: courseName, $options: "i" },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller action to search for courses by price range
module.exports.searchCoursesByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const courses = await Course.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    // Find enrollments by courseId
    const enrollments = await Enrollment.find({
      "enrolledCourses.courseId": courseId,
    });

    if (!enrollments.length) {
      return res.status(404).json({ message: "Enrollments not found" });
    }

    // Get the userIds of enrolled users from the course
    const userIds = enrollments.map((enrollment) => enrollment.userId);

    // Find the users with matching userIds
    const enrolledUsers = await User.find({ _id: { $in: userIds } });

    // Extract the emails from the enrolled users
    const emails = enrolledUsers.map((user) => user.email);

    res.status(200).json({ emails });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving enrolled users" });
  }
};
