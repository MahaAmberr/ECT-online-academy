const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/firebase");

const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors());

app.use(express.json());


// Contact API

app.use("/api/contact", contactRoutes);


// Home route

app.get("/", (req, res) => {

    res.json({

        message: "ECTS Backend API is running!"

    });

});


// Test Firebase

app.get("/test-firebase", async (req, res) => {
    try {
        const snapshot = await db
            .collection("test")
            .limit(1)
            .get();

        console.log("✅ FIRESTORE TEST SUCCESSFUL");
        console.log("Documents found:", snapshot.size);

        res.json({
            success: true,
            message: "Firebase connection successful!",
            documentsFound: snapshot.size
        });

    } catch (error) {
        console.error("❌ FIRESTORE TEST FAILED");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Full error:", error);

        res.status(500).json({
            success: false,
            message: "Firebase connection failed.",
            error: error.message,
            code: error.code
        });
    }
});