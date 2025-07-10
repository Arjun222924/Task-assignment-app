const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Verifying token...");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No token provided");
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Invalid token");
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = verifyToken;
