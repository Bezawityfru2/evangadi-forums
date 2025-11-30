const dbConnection = require("../database/dbconfig");
const { StatusCodes } = require("http-status-codes");

async function postAnswer(req, res) {
    const { question_id, content } = req.body;
    const { user_id } = req.user;

    if (!user_id) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Unauthorized",
            message: "User not authenticated",
        });
    }

    if (!question_id || !content) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Bad Request",
            message: "Please provide question_id and content",
        });
    }

    try {
        const [question] = await dbConnection.query(
            "SELECT question_id FROM questions WHERE question_id = ?",
            [question_id]
        );

        if (question.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Not Found",
                message: "Question not found",
            });
        }

        const [result] = await dbConnection.query(
            "INSERT INTO answers (user_id, question_id, content) VALUES (?, ?, ?)",
            [user_id, question_id, content]
        );

        res.status(StatusCodes.CREATED).json({
            message: "Answer posted successfully",
            answer_id: result.insertId,
        });
    } catch (error) {
        console.error("Error in postAnswer:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
}

async function getAnswerForQuestion(req, res) {
    const { question_id } = req.params;

    try {
        const [question] = await dbConnection.query(
            "SELECT question_id FROM questions WHERE question_id = ?",
            [question_id]
        );

        if (question.length === 0) {
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
            [question_id]
        );

        res.status(StatusCodes.OK).json(answers);
    } catch (error) {
        console.error("Error in getAnswerForQuestion:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
}

module.exports = { postAnswer, getAnswerForQuestion };
