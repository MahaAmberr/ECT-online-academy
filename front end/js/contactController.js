
const contactForm = document.getElementById("contact-form");
const formMessage = document.querySelector(".form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector(
            "button[type='submit']"
        );

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        formMessage.className = "form-status";
        formMessage.textContent = "";

        const formData = {
            name: contactForm.querySelector("#name").value.trim(),
            email: contactForm.querySelector("#email").value.trim(),
            phone: contactForm.querySelector("#phone").value.trim(),
            subject: contactForm.querySelector("#subject").value.trim(),
            message: contactForm.querySelector("#message").value.trim()
        };

        // Frontend validation
        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {
            formMessage.className = "form-status error";
            formMessage.textContent =
                "Please fill in all required fields.";

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";

            return;
        }

        try {
            // Send contact form data to the live Render backend
            const response = await fetch(
                "https://ect-backend.onrender.com/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            // Backend returned an error
            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to send your message."
                );
            }

            // Success
            formMessage.className = "form-status success";
            formMessage.textContent =
                "Thank you! Your message has been sent successfully.";

            // Clear the form
            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            formMessage.className = "form-status error";
            formMessage.textContent =
                error.message ||
                "Unable to send your message. Please try again.";
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
        }
    });
}
