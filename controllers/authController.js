const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("🚫 Registration failed: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    console.log("✅ User registered:", newUser.email, newUser.role);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(`🔐 Login attempt | Role: ${role} | Email: ${email}`);

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      console.log(`❌ No user found with email: ${email} and role: ${role}`);
      return res.status(401).json({ message: "Invalid credentials or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`✅ Login success (${role}): ${email}`);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Server login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
