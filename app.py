"""
Royal Tailors - Flask application.
"""

import os
import sqlite3
from pathlib import Path

from flask import Flask, flash, redirect, render_template, request, url_for


BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "bookings.db"

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", "royal-tailors-dev-secret")


def get_db_connection():
    """Create a SQLite connection for the bookings database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the bookings table if it does not already exist."""
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            preferred_date DATE NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/services")
def services():
    return render_template("services.html")


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/submit-booking", methods=["POST"])
def submit_booking():
    try:
        name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip()
        service = request.form.get("service", "").strip()
        preferred_date = request.form.get("preferred_date", "").strip()
        notes = request.form.get("notes", "").strip()

        if not all([name, phone, service, preferred_date]):
            flash("All required fields must be filled in before submitting.", "error")
            return redirect(url_for("booking"))

        digits_only_phone = "".join(ch for ch in phone if ch.isdigit())
        if len(digits_only_phone) < 10:
            flash("Please enter a valid phone number with at least 10 digits.", "error")
            return redirect(url_for("booking"))

        conn = get_db_connection()
        conn.execute(
            """
            INSERT INTO bookings (name, phone, service, preferred_date, notes)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, phone, service, preferred_date, notes),
        )
        conn.commit()
        conn.close()

        flash("Booking submitted successfully. We will confirm your appointment shortly.", "success")
    except sqlite3.OperationalError:
        flash("We could not save your booking right now. Please try again in a moment.", "error")
    except Exception:
        flash("Something went wrong while submitting your booking. Please try again.", "error")

    return redirect(url_for("booking"))


@app.route("/bookings-list")
def bookings_list():
    conn = get_db_connection()
    bookings = conn.execute(
        """
        SELECT id, name, phone, service, preferred_date, notes, created_at
        FROM bookings
        ORDER BY datetime(created_at) DESC
        """
    ).fetchall()
    conn.close()
    return render_template("bookings_list.html", bookings=bookings)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
