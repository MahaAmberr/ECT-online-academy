const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


// Verify Gmail connection when server starts

transporter.verify((error, success) => {

    if (error) {

        console.error("❌ Email configuration error:");
        console.error(error);

    } else {

        console.log("✅ Gmail SMTP connection successful");

    }

});


// Send contact notification

const sendContactNotification = async ({
    name,
    email,
    phone,
    subject,
    message
}) => {

    try {

        const mailOptions = {

            from: `"ECTS Website" <${process.env.EMAIL_USER}>`,

            to: process.env.NOTIFICATION_EMAIL,

            replyTo: email,

            subject: `New ECTS Contact Message: ${subject}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    max-width: 650px;
                    margin: auto;
                    color: #222;
                ">

                    <h2 style="
                        color: #0e1a3f;
                        margin-bottom: 10px;
                    ">
                        New ECTS Contact Message
                    </h2>


                    <p>
                        Someone has submitted the contact form
                        on your ECTS website.
                    </p>


                    <hr>


                    <p>
                        <strong>Name:</strong>
                        ${name}
                    </p>


                    <p>
                        <strong>Email:</strong>
                        ${email}
                    </p>


                    <p>
                        <strong>Phone:</strong>
                        ${phone || "Not provided"}
                    </p>


                    <p>
                        <strong>Subject:</strong>
                        ${subject}
                    </p>


                    <p>
                        <strong>Message:</strong>
                    </p>


                    <div style="
                        padding: 15px;
                        background: #f5f5f5;
                        border-radius: 8px;
                        border-left: 4px solid #0baca6;
                    ">
                        ${message}
                    </div>


                    <hr>


                    <p style="
                        color: #666;
                        font-size: 14px;
                    ">
                        This message was submitted through
                        the ECTS website contact form.
                    </p>


                    <p style="
                        color: #666;
                        font-size: 14px;
                    ">
                        You can reply directly to this email
                        to contact the person who submitted
                        the form.
                    </p>

                </div>
            `
        };


        const info = await transporter.sendMail(mailOptions);


        console.log("✅ Contact notification email sent");

        console.log("Message ID:", info.messageId);


        return info;


    } catch (error) {

        console.error("❌ Failed to send contact notification:");

        console.error(error);

        throw error;

    }

};


module.exports = {
    sendContactNotification
};