const dbConnection = require("../database/dbconfig");
const { StatusCodes } = require("http-status-codes");

async function postQuestion(req, res) {
    const { title, description, tag } = req.body;
    const { user_id } = req.user;

    if (!title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Bad Request",
            message: "Please provide title and description",
        });
    }

    try {
        const [result] = await dbConnection.query(
            "INSERT INTO questions (user_id, title, description, tag) VALUES (?, ?, ?, ?)",
            [user_id, title, description, tag || null]
        );
        res.status(StatusCodes.CREATED).json({
            message: "Question posted successfully",
            question_id: result.insertId,
        });
    } catch (error) {
        console.error("Error in postQuestion:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
}

async function getAllQuestions(req, res) {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const [questions] = await dbConnection.query(
            `SELECT q.question_id, q.title, q.description, q.tag, q.created_at, u.username
             FROM questions q
             JOIN users u ON q.user_id = u.user_id
             ORDER BY q.created_at DESC
             LIMIT ? OFFSET ?`,
            [parseInt(limit), parseInt(offset)]
        );
        res.status(StatusCodes.OK).json(questions);
    } catch (error) {
        console.error("Error in getAllQuestions:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
}

async function getSingleQuestion(req, res) {
    const { id } = req.params;

    try {
        const [questions] = await dbConnection.query(
            `SELECT q.question_id, q.title, q.description, q.tag, q.created_at, u.username
             FROM questions q
             JOIN users u ON q.user_id = u.user_id
             WHERE q.question_id = ?`,
            [id]
        );

        if (questions.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Not Found",
                message: "Question not found",
            });
        }

        const [answers] = await dbConnection.query(
            `SELECT a.answer_id, a.content, a.created_at, u.username
             FROM answers a 
             JOIN users u ON a.user_id = u.user_id
             WHERE a.question_id = ?
             ORDER BY a.created_at ASC`,
            [id]
        );

        res.status(StatusCodes.OK).json({
            question: { ...questions[0], answers },
        });
    } catch (error) {
        console.error("Error in getSingleQuestion:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
}

module.exports = { postQuestion, getAllQuestions, getSingleQuestion };
