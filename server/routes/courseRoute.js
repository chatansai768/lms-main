const express = require("express")

const { protect, authorize } = require("../middleware/authMiddleware")

const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseByID
} = require("../controllers/courseControllers")

const courseRoute = express.Router()

courseRoute.get("/", getCourses)

courseRoute.post("/", protect, authorize("instructor"), createCourse)

courseRoute.get("/:id", getCourseByID)

courseRoute.put("/:id", protect, authorize("instructor", "admin"), updateCourse)

courseRoute.delete("/:id", protect, authorize("instructor", "admin"), deleteCourse)

module.exports = courseRoute