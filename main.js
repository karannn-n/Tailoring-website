document.addEventListener("DOMContentLoaded", () => {

    // MOBILE MENU
    const mobileButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            mobileButton.classList.toggle("is-open");
            mobileButton.setAttribute(
                "aria-expanded",
                mobileMenu.classList.contains("active") ? "true" : "false"
            );
        });
    }

    // HEADER SCROLL EFFECT
    const header = document.querySelector(".site-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.background = "rgba(7,7,10,0.95)";
            header.style.backdropFilter = "blur(20px)";
        } else {
            header.style.background = "linear-gradient(180deg, rgba(7,7,10,0.85), rgba(7,7,10,0.15))";
        }
    });

    // DATE MIN TODAY
    const dateInput = document.getElementById("preferred_date");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
    }

    // GALLERY FILTER
    const galleryButtons = document.querySelectorAll("[data-filter]");
    if (galleryButtons.length) {
        galleryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                filterGallery(button.dataset.filter, button);
            });
        });
    }

    // SCROLL ANIMATION (UPGRADED - INTERSECTION OBSERVER)
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        animatedElements.forEach((el) => observer.observe(el));
    } else {
        animatedElements.forEach((el) => el.classList.add("is-visible"));
    }

    // AUTO HIDE ALERTS
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach((alert) => {
        setTimeout(() => {
            alert.style.opacity = "0";
            setTimeout(() => alert.remove(), 250);
        }, 5000);
    });

});


// GALLERY FILTER FUNCTION
function filterGallery(category, button) {
    const items = document.querySelectorAll(".gallery-item");
    const buttons = document.querySelectorAll("[data-filter]");

    buttons.forEach((btn) => btn.classList.remove("filter-btn--active"));
    if (button) button.classList.add("filter-btn--active");

    items.forEach((item) => {
        const show = category === "all" || item.dataset.category === category;

        if (show) {
            item.style.display = "";
            setTimeout(() => item.classList.remove("is-hidden"), 10);
        } else {
            item.classList.add("is-hidden");
            setTimeout(() => item.style.display = "none", 200);
        }
    });
}


// FORM VALIDATION
function validateBookingForm() {
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const service = document.getElementById("service");
    const preferredDate = document.getElementById("preferred_date");

    if (!name.value.trim()) {
        showError("Please enter your name.");
        return false;
    }

    if (!phone.value.trim() || phone.value.replace(/\D/g, "").length < 10) {
        showError("Please enter a valid phone number.");
        return false;
    }

    if (!service.value) {
        showError("Please select a service.");
        return false;
    }

    if (!preferredDate.value) {
        showError("Please select a date.");
        return false;
    }

    const selectedDate = new Date(preferredDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showError("Please select a future date.");
        return false;
    }

    return true;
}


// ERROR DISPLAY
function showError(message) {
    const form = document.querySelector("form");
    if (!form) return;

    const existing = form.querySelector(".alert-error");
    if (existing) existing.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-error";
    errorDiv.innerHTML = `
        <span class="alert__icon">
            <i class="fas fa-circle-exclamation"></i>
        </span>
        <span>${message}</span>
    `;

    form.prepend(errorDiv);

    setTimeout(() => {
        errorDiv.style.opacity = "0";
        setTimeout(() => errorDiv.remove(), 250);
    }, 4500);
}


// PHONE FORMAT
function formatPhoneNumber(input) {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
}
