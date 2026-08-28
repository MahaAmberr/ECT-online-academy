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

        await db
            .collection("test")
            .limit(1)
            .get();

        res.json({

            success: true,

            message: "Firebase connection successful!"

        });

    } catch (error) {

        console.error(
            "Firebase error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Firebase connection failed."

        });

    }

});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});