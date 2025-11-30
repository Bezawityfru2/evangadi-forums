const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
    postQuestion,
    getAllQuestions,
    getSingleQuestion,
} = require("../controller/questionController");

router.post("/", authMiddleware, postQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getSingleQuestion);

module.exports = router; // export the router
