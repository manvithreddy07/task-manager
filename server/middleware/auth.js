const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing auth header" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid auth format" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;