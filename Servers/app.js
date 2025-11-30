require("dotenv").config();
const express = require("express");
const cors = require("cors")


const app = express();
app.use(express.json());
app.use(cors());

// user router middleware file
 const userRoute = require("./routes/userRoute");
 const questionRoute = require("./routes/questionRoute");
 const answerRoute = require("./routes/answerRoute");

// db connection
const dbConnection = require("./database/dbconfig")

// user router middleware 
app.use("/api/users", userRoute);
app.use("/api/question", questionRoute);
app.use("/api/answers", answerRoute)


async function start() {
    try{
        const [result] = await dbConnection.query("SELECT 'test' AS test");
        console.log("Database test successful:", result);
        const PORT = process.env.PORT || 5500;
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
}

start();