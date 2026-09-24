const Course = require("../models/course")

async function getCourses(req, res) {
    try {
        const courses = await Course.find().populate("instructor", "name email")
        return res.status(200).send(courses)
    } catch (error) {
        return res.status(500).send({
            message: "Unable to access course"
        })
    }
}

async function createCourse(req, res) {
    try {
        const { title, description, category, level, price, duration } = req.body

        if (!title || !description || !category || !level || price === undefined || !duration) {
            return res.status(400).send({
                message: "Bad Request: Missing required fields"
            })
        }
        
        const existingCourse = await Course.findOne({ title: title })
        if (existingCourse) {
            return res.status(400).send({
                message: "Bad Request, Course already exists"
            })
        }

        const course = new Course({
            title: title,
            description: description,
            instructor: req.user._id,
            category: category,
            level: level,
            price: price,
            duration: duration
        })
        
        await course.save()
        return res.status(201).send({
            message: "New course created",
            course
        })
    } catch (error) {
        console.error("ERROR CREATING COURSE:", error);
        return res.status(500).send({
            message: "Unable to create course"
        })
    }
}

async function deleteCourse(req,res){
    try{
        const {id}=req.params

        const course=await Course.findById(id)
        if(!course){
            return res.status(404).send({
                message : "Course not found"
            })
        }
        if(req.user.role!=="instructor" && (!course.instructor || !course.instructor.equals(req.user._id))){
            return res.status(403).send({
                message : "You can only delete courses you created."
            })
        }
        await course.deleteOne({_id:id})

        return res.status(200).send({
            message : "Course deleted"
        })
    }
    catch(error){
        console.log("Delete course error:", error);

        return res.status(500).send({
            message: "Unable to delete course",
            error: error.message
        });
    }
}

async function updateCourse(req, res) {
    try {
        const courseId = req.params.id
        const updates = req.body

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).send({
                message: "Course not found"
            })
        }

        // Ensure the instructor owns the course or is an admin
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).send({
                message: "Unauthorized to update this course"
            })
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, { 
            new: true, 
            runValidators: true 
        })

        return res.status(200).send({
            message: "Course updated successfully",
            course: updatedCourse
        })
    } catch (error) {
        return res.status(500).send({
            message: "Unable to update course"
        })
    }
}

async function getCourseByID(req, res) {
    try {
        const courseId = req.params.id
        const course = await Course.findById(courseId).populate("instructor", "name email")

        if (!course) {
            return res.status(404).send({
                message: "Course not found"
            })
        }

        return res.status(200).send(course)
    } catch (error) {
        return res.status(500).send({
            message: "Unable to fetch course"
        })
    }
}

module.exports = {
    getCourses,
    createCourse,
    deleteCourse,
    updateCourse,
    getCourseByID
}