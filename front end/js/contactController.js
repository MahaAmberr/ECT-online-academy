const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

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
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        phone: contactForm.phone.value.trim(),
        subject: contactForm.subject.value.trim(),
        message: contactForm.message.value.trim()
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
        // Send the form data to your LIVE Render backend
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
                data.message || "Something went wrong."
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
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});
}
