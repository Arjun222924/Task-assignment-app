const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash("aran2229", 10); 

    const admin = new User({
      name: "Arjun Selva",
      email: "arjun@example.com",     
      password: hashedPassword,
      mobile: "7667109142",
      role: "admin"
    });

    await admin.save();
     process.exit();
  } catch (err) {
    console.error
    process.exit(1);
  }
};

createAdmin();
