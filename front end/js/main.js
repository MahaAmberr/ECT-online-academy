// ============================================================
// ECTS ACADEMY - MAIN JAVASCRIPT
// ============================================================


// ============================================================
// MOBILE NAVIGATION
// ============================================================

function initMobileNav() {

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener("click", () => {

        const isOpen =
            navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        navLinks.classList.toggle("is-open", !isOpen);

    });


    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            navLinks.classList.remove("is-open");

        });

    });

}


// ============================================================
// FAQ ACCORDION
// ============================================================

function initFAQ() {

    const items = document.querySelectorAll(".faq-item");

    if (!items.length) return;


    items.forEach((item) => {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");

        if (!question || !answer) return;


        question.addEventListener("click", () => {

            const isOpen =
                item.getAttribute("aria-expanded") === "true";


            items.forEach((other) => {

                other.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const otherAnswer =
                    other.querySelector(".faq-answer");

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

            });


            if (!isOpen) {

                item.setAttribute(
                    "aria-expanded",
                    "true"
                );

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        });

    });

}


// ============================================================
// SCROLL REVEAL
// ============================================================

function initScrollReveal() {

    const revealElements =
        document.querySelectorAll(".reveal");

    if (!revealElements.length) return;


    // If IntersectionObserver is supported
    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach((element) => {

            observer.observe(element);

        });

    } else {

        // Fallback for older browsers

        revealElements.forEach((element) => {

            element.classList.add("is-visible");

        });

    }

}


// ============================================================
// BACK TO TOP BUTTON
// ============================================================

function initBackToTop() {

    const button =
        document.querySelector(".back-to-top");

    if (!button) return;


    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            button.classList.add("is-visible");

        } else {

            button.classList.remove("is-visible");

        }

    });


    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// ============================================================
// CONTACT FORM → BACKEND
// ============================================================

function initContactForm() {

    const form =
        document.querySelector("#contact-form");

    if (!form) return;


    const status =
        form.querySelector(".form-status");


    const validators = {

        name: (value) =>
            value.trim().length >= 2 ||
            "Enter your full name.",


        email: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
            "Enter a valid email address.",


        phone: (value) =>
            value.trim() === "" ||
            /^[0-9+\-\s()]{7,}$/.test(value) ||
            "Enter a valid phone number.",


        subject: (value) =>
            value.trim().length >= 3 ||
            "Let us know what this is about.",


        message: (value) =>
            value.trim().length >= 10 ||
            "Message should be at least 10 characters."

    };


    // ========================================================
    // VALIDATE INDIVIDUAL FIELD
    // ========================================================

    function validateField(field) {

        const rule =
            validators[field.name];

        if (!rule) return true;


        const result =
            rule(field.value);


        const wrapper =
            field.closest(".form-field");


        if (!wrapper) {

            return result === true;

        }


        const errorElement =
            wrapper.querySelector(
                ".error-msg, .error-message"
            );


        if (result === true) {

            wrapper.classList.remove(
                "has-error"
            );

            if (errorElement) {

                errorElement.textContent = "";

            }

            return true;

        }


        wrapper.classList.add(
            "has-error"
        );


        if (errorElement) {

            errorElement.textContent =
                result;

        }


        return false;

    }


    // ========================================================
    // VALIDATE WHEN USER LEAVES FIELD
    // ========================================================

    form.querySelectorAll(
        "input, textarea"
    ).forEach((field) => {

        field.addEventListener(
            "blur",
            () => {

                validateField(field);

            }
        );

    });


    // ========================================================
    // SUBMIT CONTACT FORM
    // ========================================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ------------------------------------------------
            // Validate all fields
            // ------------------------------------------------

            const fields =
                Array.from(
                    form.querySelectorAll(
                        "input, textarea"
                    )
                );


            const allValid =
                fields
                    .map(validateField)
                    .every(Boolean);


            if (!allValid) {

                if (status) {

                    status.textContent = "";

                    status.className =
                        "form-status";

                }

                return;

            }


            // ------------------------------------------------
            // Show sending message
            // ------------------------------------------------

            if (status) {

                status.textContent =
                    "Sending your message...";

                status.className =
                    "form-status is-visible";

            }


            // ------------------------------------------------
            // Collect form data
            // ------------------------------------------------

            const formData =
                new FormData(form);


            const contactData =
                Object.fromEntries(
                    formData.entries()
                );


            console.log(
                "Sending contact data:",
                contactData
            );


            // ------------------------------------------------
            // SEND TO BACKEND
            // ------------------------------------------------

            try {

                const response =
                    await fetch(
                        "https://ect-backend.onrender.com/api/contact",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    contactData
                                )
                        }
                    );


                // ------------------------------------------------
                // Convert response to JSON
                // ------------------------------------------------

                const data =
                    await response.json();


                // ------------------------------------------------
                // Backend error
                // ------------------------------------------------

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to send your message."
                    );

                }


                // ------------------------------------------------
                // SUCCESS
                // ------------------------------------------------

                if (status) {

                    status.textContent =
                        "Message sent successfully! Our team will get back to you soon.";

                    status.className =
                        "form-status is-visible success";

                }


                // ------------------------------------------------
                // Clear form
                // ------------------------------------------------

                form.reset();


                // ------------------------------------------------
                // Remove validation errors
                // ------------------------------------------------

                form.querySelectorAll(
                    ".form-field"
                ).forEach((field) => {

                    field.classList.remove(
                        "has-error"
                    );

                });


                form.querySelectorAll(
                    ".error-msg, .error-message"
                ).forEach((error) => {

                    error.textContent = "";

                });

            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                if (status) {

                    status.textContent =
                        error.message ||
                        "Something went wrong. Please try again.";

                    status.className =
                        "form-status is-visible error";

                }

            }

        }
    );

}


// ============================================================
// FOOTER YEAR
// ============================================================

function initYear() {

    const yearElement =
        document.querySelector(
            "#current-year"
        );


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }

}


// ============================================================
// INITIALIZE EVERYTHING
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initMobileNav();

        initFAQ();

        initScrollReveal();

        initBackToTop();

        initContactForm();

        initYear();

    }
);