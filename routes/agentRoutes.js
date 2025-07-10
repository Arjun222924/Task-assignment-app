const express = require("express");
const router = express.Router();
const { addAgent, getAllAgents } = require("../controllers/agentController");
const authMiddleware = require("../middleware/authMiddleware"); 


router.post("/", authMiddleware, addAgent);


router.get("/", authMiddleware, getAllAgents);

module.exports = router;
