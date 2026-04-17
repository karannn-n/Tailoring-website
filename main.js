document.addEventListener("DOMContentLoaded", () => {
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

    const dateInput = document.getElementById("preferred_date");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
    }

    const galleryButtons = document.querySelectorAll("[data-filter]");
    if (galleryButtons.length) {
        galleryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                filterGallery(button.dataset.filter, button);
            });
        });
    }

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
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        animatedElements.forEach((element) => observer.observe(element));
    } else {
        animatedElements.forEach((element) => element.classList.add("is-visible"));
    }

    const alerts = document.querySelectorAll(".alert");
    alerts.forEach((alert) => {
        setTimeout(() => {
            alert.style.opacity = "0";
            setTimeout(() => alert.remove(), 220);
        }, 5000);
    });
});

function filterGallery(category, button) {
    const items = document.querySelectorAll(".gallery-item");
    const buttons = document.querySelectorAll("[data-filter]");

    buttons.forEach((item) => item.classList.remove("filter-btn--active"));
    if (button) {
        button.classList.add("filter-btn--active");
    }

    items.forEach((item) => {
        const shouldShow = category === "all" || item.dataset.category === category;
        item.classList.toggle("is-hidden", !shouldShow);
        item.style.display = shouldShow ? "" : "none";
    });
}

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
        showError("Please enter a valid phone number with at least 10 digits.");
        return false;
    }

    if (!service.value) {
        showError("Please select the service you are booking for.");
        return false;
    }

    if (!preferredDate.value) {
        showError("Please choose a preferred appointment date.");
        return false;
    }

    const selectedDate = new Date(preferredDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showError("Please choose today or a future date.");
        return false;
    }

    return true;
}

function showError(message) {
    const form = document.querySelector("form");
    if (!form) {
        return;
    }

    const existing = form.querySelector(".alert-error");
    if (existing) {
        existing.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-error";
    errorDiv.innerHTML = `<span class="alert__icon"><i class="fas fa-circle-exclamation"></i></span><span>${message}</span>`;
    form.prepend(errorDiv);

    setTimeout(() => {
        errorDiv.style.opacity = "0";
        setTimeout(() => errorDiv.remove(), 220);
    }, 4500);
}

function formatPhoneNumber(input) {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
}
