from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB = "database.db"


def get_db():
    return sqlite3.connect(DB)


@app.route("/api/programs")
def get_programs():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT p.id, p.name, p.total_seats,
           COUNT(e.id) as enrolled
    FROM programs p
    LEFT JOIN enrollments e ON p.id = e.program_id
    GROUP BY p.id
    """)

    programs = []
    for row in cursor.fetchall():
        programs.append({
            "id": row[0],
            "name": row[1],
            "totalSeats": row[2],
            "freeSeats": row[2] - row[3]
        })

    conn.close()
    return jsonify(programs)


@app.route("/api/enroll", methods=["POST"])
def enroll():
    data = request.json
    program_id = data["programId"]
    email = data["email"]
    date = data["date"]

    conn = get_db()
    cursor = conn.cursor()

    # seat check
    cursor.execute(
        "SELECT total_seats FROM programs WHERE id = ?",
        (program_id,)
    )
    total = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM enrollments WHERE program_id = ?",
        (program_id,)
    )
    enrolled = cursor.fetchone()[0]

    if enrolled >= total:
        return jsonify({"error": "No seats left"}), 400

    try:
        cursor.execute(
            "INSERT INTO enrollments (program_id, email, date) VALUES (?, ?, ?)",
            (program_id, email, date)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Already enrolled"}), 400

    conn.close()
    return jsonify({"success": True})


@app.route("/api/calendar")
def calendar():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT program_id, email, date FROM enrollments
    """)
    data = [
        {"programId": r[0], "email": r[1], "date": r[2]}
        for r in cursor.fetchall()
    ]

    conn.close()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
