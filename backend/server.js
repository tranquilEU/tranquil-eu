// server.js
require("dotenv").config();
const express = require("express");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function createTransporter() {
  // Generate a test SMTP account
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter using Ethereal's SMTP
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
}

const app = express();
app.use(express.json());
// Allow requests from your Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // if you plan to send cookies
  })
);

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// JWT helpers
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}
function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Middleware: require auth
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Swagger setup
const swaggerDefinition = {
  openapi: "3.0.1",
  info: {
    title: "Login API",
    version: "1.0.0",
    description: "Simple login API using JWT",
  },
  servers: [{ url: "http://localhost:" + PORT }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      TokenResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
        },
      },
      RefreshRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string" },
        },
      },
      MeResponse: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      ForgotPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["token", "password"],
        properties: {
          token: { type: "string" },
          password: { type: "string", minLength: 6 },
        },
      },
      ForgotPasswordResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      ResetPasswordResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./server.js"], // Read JSDoc from this file
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Bad request or user exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    const user = result.rows[0];
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = generateRefreshToken({
      sub: user.id,
      email: user.email,
    });
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '7 days')",
      [user.id, refreshToken]
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Refresh token is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post("/api/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "refreshToken is required" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Check DB
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token=$1 AND user_id=$2 AND expires_at > NOW()",
      [refreshToken, decoded.sub]
    );
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      sub: decoded.sub,
      email: decoded.email,
    });
    res.json({ accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       400:
 *         description: Refresh token is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LogoutRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token to invalidate
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Logged out
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Refresh token is required
 */

app.post("/api/auth/logout", async (req, res) => {
  const { refreshToken } = req.body;

  // Validate input
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    // Delete token from DB
    await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [
      refreshToken,
    ]);

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: If email exists, reset link sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       400:
 *         description: If email doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: "X8f6B@example.com"
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: If email exists, reset link sent
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: If email doesn't exist
 */
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  if (!user.rows.length)
    return res
      .status(200)
      .json({ message: "If email exists, reset link sent" });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min expiry

  await pool.query(
    "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [user.rows[0].id, token, expiresAt]
  );

  // TODO: send email with link
  const resetLink = `http://localhost:5173/reset-password/${token}`;
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: '"MyApp Support" <no-reply@myapp.com>',
    to: email,
    subject: "Password Reset Request",
    html: `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password (valid for 15 minutes):</p>
    <a href="${resetLink}">${resetLink}</a>
  `,
  });

  // Preview URL (only works with Ethereal)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res
    .status(200)
    .json({ message: "If email exists, reset link sent", status: "success" });
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           description: The reset token
 *           example: "my-reset-token"
 *         password:
 *           type: string
 *           description: The new password
 *           example: "new-password"
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Password updated successfully
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Invalid or expired token
 */
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const reset = await pool.query(
    "SELECT * FROM password_resets WHERE token=$1 AND expires_at > NOW()",
    [token]
  );
  if (!reset.rows.length)
    return res.status(400).json({ error: "Invalid or expired token" });

  const hashed = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password_hash=$1 WHERE id=$2", [
    hashed,
    reset.rows[0].user_id,
  ]);

  // Invalidate token
  await pool.query("DELETE FROM password_resets WHERE token=$1", [token]);

  res
    .status(200)
    .json({ message: "Password updated successfully", status: "success" });
});

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// ME
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email FROM users WHERE id=$1", [
      req.user.sub,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Serve the Swagger JSON file
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
