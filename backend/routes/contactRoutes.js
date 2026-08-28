
const express = require("express");
const router = express.Router();

const db = require("../config/firebase");
const { sendContactNotification } = require("../services/emailService");

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

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Prepare Firestore document
        const contactData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : "",
            subject: subject.trim(),
            message: message.trim(),
            status: "unread",
            createdAt: new Date()
        };

        console.log("Saving contact message to Firestore...");

        // SAVE TO FIRESTORE
        const messageRef = await db
            .collection("messages")
            .add(contactData);

        console.log(
            "Firestore document created:",
            messageRef.id
        );

        // Send email notification
        try {
            await sendContactNotification({
                name,
                email,
                phone,
                subject,
                message
            });

            console.log("Email notification sent.");
        } catch (emailError) {
            console.error(
                "Email notification failed:",
                emailError
            );
        }

        // Send success response
        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!",
            messageId: messageRef.id
        });

    } catch (error) {
        console.error(
            "CONTACT API / FIRESTORE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to save your message.",
            error: error.message
        });
    }
});

module.exports = router;

