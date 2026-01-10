import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    name TEXT,
    total_seats INTEGER
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    program_id TEXT,
    email TEXT,
    date TEXT,
    UNIQUE(program_id, email, date)
)
""")

programs = [
    ("group-classes", "Group Classes", 20),
    ("individual-training", "Individual Training", 5),
    ("performance-programs", "Performance Programs", 10),
]

cursor.executemany(
    "INSERT OR IGNORE INTO programs VALUES (?, ?, ?)",
    programs
)

conn.commit()
conn.close()

print("Database initialized")
