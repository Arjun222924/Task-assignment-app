const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Agent with this email already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const agent = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "agent",
    });

    await agent.save();
    res.status(201).json({ message: "Agent created successfully", agent });
  } catch (error) {
    console.error("❌ Error adding agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password"); 
    res.status(200).json(agents);
  } catch (error) {
    console.error("❌ Error fetching agents:", error);
    res.status(500).json({ message: "Server error fetching agents" });
  }
};
