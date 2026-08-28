const express = require("express");

const router = express.Router();

const db = require("../config/firebase");

const {
    sendContactNotification
} = require("../services/emailService");


router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            subject,
            message
        } = req.body;


        // Validate required fields

        if (!name || !email || !subject || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });

        }


        // Basic email validation

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }


        // Create contact message

        const contactData = {

            name,
            email,
            phone: phone || "",
            subject,
            message,

            status: "unread",

            createdAt: new Date()

        };


        // Save to Firestore

        const messageRef = await db
            .collection("messages")
            .add(contactData);


        // Send email notification

        try {

            await sendContactNotification({

                name,
                email,
                phone,
                subject,
                message

            });

        } catch (emailError) {

            console.error(
                "Email notification failed:",
                emailError
            );

        }


        // Respond to frontend

        res.status(201).json({

            success: true,

            message:
                "Your message has been sent successfully!",

            messageId: messageRef.id

        });


    } catch (error) {

        console.error(
            "Contact API Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to send your message."

        });

    }

});


module.exports = router;