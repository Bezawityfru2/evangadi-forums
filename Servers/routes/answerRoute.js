const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
    postAnswer,
    getAnswerForQuestion,
} = require("../controller/answerController");

router.post("/", authMiddleware, postAnswer);
router.get("/:question_id", getAnswerForQuestion);

module.exports = router; // export the router, not the middleware
