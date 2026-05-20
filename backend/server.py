from flask import Flask, jsonify, request, session, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import secrets
import mimetypes
import uuid

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))
CORS(app, supports_credentials=True)

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "out"))
print(f"[STARTUP] OUT_DIR = {OUT_DIR}", flush=True)
print(f"[STARTUP] out/ exists: {os.path.isdir(OUT_DIR)}", flush=True)
print(f"[STARTUP] index.html exists: {os.path.isfile(os.path.join(OUT_DIR, 'index.html'))}", flush=True)

# Health check — Railway uses this to verify the container is healthy
@app.route("/health")
def health():
    return "ok", 200

# Simple file-based storage
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "oasis123")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def read_data(name):
    path = os.path.join(DATA_DIR, f"{name}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None


def write_data(name, data):
    path = os.path.join(DATA_DIR, f"{name}.json")
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


# Default data
DEFAULT_PROFILE = {
    "name": "Bobur Abdurasulov",
    "title": "Full-Stack Developer",
    "bio": "Crafting premium digital experiences with modern web technologies. Passionate about building scalable, performant, and beautiful applications.",
    "email": "hello@oasis.dev",
    "github": "https://github.com/bobur",
    "linkedin": "https://linkedin.com/in/bobur",
    "telegram": "https://t.me/Bobur_abdurasulov",
}

DEFAULT_SKILLS = [
    {"name": "Python", "icon": "python"},
    {"name": "JavaScript", "icon": "javascript"},
    {"name": "React", "icon": "react"},
    {"name": "Three.js", "icon": "threejs"},
    {"name": "Node.js", "icon": "nodejs"},
    {"name": "Full-stack", "icon": "fullstack"},
    {"name": "Admin Panel Design", "icon": "admin"},
]

DEFAULT_PROJECTS = [
    {
        "id": 1,
        "title": "Neon Dashboard",
        "description": "Real-time analytics platform with AI-powered insights and stunning data visualization.",
        "tech": ["React", "Python", "AI"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/bobur/neon-dashboard",
    },
    {
        "id": 2,
        "title": "Stream Verse",
        "description": "Cinematic streaming platform with immersive 3D interactions and adaptive streaming.",
        "tech": ["Next.js", "Three.js", "FastAPI"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/bobur/stream-verse",
    },
    {
        "id": 3,
        "title": "Crypto Vault",
        "description": "Secure cryptocurrency wallet with biometric authentication and real-time market data.",
        "tech": ["React Native", "Node.js", "Web3"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/bobur/crypto-vault",
    },
    {
        "id": 4,
        "title": "AI Assistant",
        "description": "Intelligent automation platform with natural language processing and workflow automation.",
        "tech": ["Python", "AI", "FastAPI"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/bobur/ai-assistant",
    },
]

DEFAULT_EXPERIENCE = [
    {
        "role": "Senior Full-Stack Developer",
        "company": "Tech Corp",
        "period": "2023 - Present",
        "description": "Leading development of scalable web applications serving millions of users.",
    },
    {
        "role": "Full-Stack Developer",
        "company": "Digital Agency",
        "period": "2021 - 2023",
        "description": "Built premium websites and admin panels for Fortune 500 clients.",
    },
    {
        "role": "Frontend Developer",
        "company": "StartupXYZ",
        "period": "2019 - 2021",
        "description": "Developed React-based SaaS platform with real-time collaboration features.",
    },
]


def get_data(name, default):
    data = read_data(name)
    if data is None:
        write_data(name, default)
        return default
    return data


# ============================================================
# PUBLIC API
# ============================================================

@app.route("/api/profile")
def get_profile():
    return jsonify(get_data("profile", DEFAULT_PROFILE))


@app.route("/api/skills")
def get_skills():
    return jsonify(get_data("skills", DEFAULT_SKILLS))


@app.route("/api/projects")
def get_projects():
    return jsonify(get_data("projects", DEFAULT_PROJECTS))


@app.route("/api/experience")
def get_experience():
    return jsonify(get_data("experience", DEFAULT_EXPERIENCE))


# ============================================================
# ADMIN API
# ============================================================

def require_auth():
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {ADMIN_PASSWORD}":
        return False
    return True


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    if data.get("password") == ADMIN_PASSWORD:
        return jsonify({"ok": True, "token": ADMIN_PASSWORD})
    return jsonify({"ok": False, "error": "Invalid password"}), 401


@app.route("/api/admin/profile", methods=["PUT"])
def admin_update_profile():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    current = get_data("profile", DEFAULT_PROFILE)
    current.update(data)
    write_data("profile", current)
    return jsonify({"ok": True, "data": current})


@app.route("/api/admin/skills", methods=["PUT"])
def admin_update_skills():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    items = data.get("skills", [])
    write_data("skills", items)
    return jsonify({"ok": True, "data": items})


@app.route("/api/admin/projects", methods=["POST"])
def admin_add_project():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    projects = get_data("projects", DEFAULT_PROJECTS)
    max_id = max((p.get("id", 0) for p in projects), default=0)
    data["id"] = max_id + 1
    projects.append(data)
    write_data("projects", projects)
    return jsonify({"ok": True, "data": data})


@app.route("/api/admin/projects/<int:pid>", methods=["PUT"])
def admin_update_project(pid):
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    projects = get_data("projects", DEFAULT_PROJECTS)
    for p in projects:
        if p.get("id") == pid:
            p.update(data)
            write_data("projects", projects)
            return jsonify({"ok": True, "data": p})
    return jsonify({"ok": False, "error": "Not found"}), 404


@app.route("/api/admin/projects/<int:pid>", methods=["DELETE"])
def admin_delete_project(pid):
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    projects = get_data("projects", DEFAULT_PROJECTS)
    projects = [p for p in projects if p.get("id") != pid]
    write_data("projects", projects)
    return jsonify({"ok": True})


@app.route("/api/admin/experience", methods=["POST"])
def admin_add_experience():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    exp = get_data("experience", DEFAULT_EXPERIENCE)
    exp.append(data)
    write_data("experience", exp)
    return jsonify({"ok": True, "data": data})


@app.route("/api/admin/experience/<int:eid>", methods=["PUT"])
def admin_update_experience(eid):
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    exp = get_data("experience", DEFAULT_EXPERIENCE)
    if eid < len(exp):
        exp[eid].update(data)
        write_data("experience", exp)
        return jsonify({"ok": True, "data": exp[eid]})
    return jsonify({"ok": False, "error": "Not found"}), 404


@app.route("/api/admin/experience/<int:eid>", methods=["DELETE"])
def admin_delete_experience(eid):
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    exp = get_data("experience", DEFAULT_EXPERIENCE)
    if eid < len(exp):
        exp.pop(eid)
        write_data("experience", exp)
        return jsonify({"ok": True})
    return jsonify({"ok": False, "error": "Not found"}), 404


# ============================================================
# FILE / IMAGE UPLOAD
# ============================================================

@app.route("/api/admin/upload", methods=["POST"])
def admin_upload():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    if "file" not in request.files:
        return jsonify({"ok": False, "error": "No file"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"ok": False, "error": "No file"}), 400
    ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else "bin"
    name = f"{uuid.uuid4().hex}.{ext}"
    f.save(os.path.join(UPLOAD_DIR, name))
    is_image = ext in ("png", "jpg", "jpeg", "gif", "webp", "svg")
    return jsonify({
        "ok": True,
        "url": f"/uploads/{name}",
        "name": f.filename,
        "is_image": is_image,
    })


@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)


# Serve SPA routes (must be last!)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if not path:
        path = "index.html"
    full = os.path.join(OUT_DIR, path)
    if os.path.isfile(full):
        mimetype, _ = mimetypes.guess_type(full)
        return send_file(full, mimetype=mimetype)
    index = os.path.join(full, "index.html")
    if os.path.isfile(index):
        return send_file(index, mimetype="text/html")
    return send_file(os.path.join(OUT_DIR, "index.html"), mimetype="text/html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
