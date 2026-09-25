const express = require("express")
const connectDB = require("./config/db")
const dotenv = require("dotenv")
const courseRoute = require("./routes/courseRoute")
const authRoute = require("./routes/authRoutes")
const cors = require("cors")

const app = express()

dotenv.config()

app.use(express.json())

app.use(cors({
    origin: "https://remarkable-swan-1764a6.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}))

app.get("/welcome", (req, res) => {
    res.send("Welcome Back")
})

app.use("/api/courses", courseRoute)
app.use("/api/auth", authRoute)

connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})