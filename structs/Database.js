const mongoose = require("mongoose");
const path = require("path");

const config = require(path.join(__dirname, "../config/Config.json"));

async function connectDB() {
    try {
        await mongoose.connect(config.mongodb.database);
        console.log("✅ Connected to MongoDB!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); 
    }
}

module.exports = connectDB;