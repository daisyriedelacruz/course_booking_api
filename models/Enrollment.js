const mongoose = require("mongoose");

// Schema
const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  enrolledCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Course ID is required"],
        ref: "Course",
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  enrolledOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Enrolled",
  },
});

// Model
module.exports = mongoose.model("Enrollment", enrollmentSchema);
