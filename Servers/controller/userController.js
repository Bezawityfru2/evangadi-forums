const dbConnection = require("../database/dbconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

require("dotenv").config();

// ==== REGISTER ====
async function register(req, res) {
    const { username, first_name, last_name, email, password } = req.body;

    if (!username || !first_name || !last_name || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Bad Request",
            message: "Please provide all required fields",
        });
    }

    if (password.length < 8) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Bad Request",
            message: "Password must be at least 8 characters",
        });
    }

    try {
        // Check if user exists
        const [users] = await dbConnection.query(
            "SELECT user_id FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (users.length > 0) {
            return res.status(StatusCodes.CONFLICT).json({
                error: "Conflict",
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await dbConnection.query("INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
        [username, first_name, last_name, email, hashedPassword])

       return  res.status(StatusCodes.CREATED).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.error("Error in register:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Internal Server Error",
            message: error.message || "Unexpected error occurred",
        });
    }
}



// ========= LOGIN =========
async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  // Validate required fields
  if (!usernameOrEmail || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Find user by username or email
    const [users] = await dbConnection.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [usernameOrEmail, usernameOrEmail]
    );

    if (users.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "User login successful", token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}


// ===================== CHECK USER =====================
async function checkUser(req, res) {
    return res.status(StatusCodes.OK).json({
        message: "valid user",
        username: req.user.username,
        user_id: req.user.user_id,
    });
}

module.exports = { register, login, checkUser };
