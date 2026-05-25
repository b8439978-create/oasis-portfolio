from flask import Flask, jsonify, request, session, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import os
import json
import secrets
import mimetypes
import uuid

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))
CORS(app, supports_credentials=True)

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "out"))

# ── Database Setup ──
DATABASE_URL = os.environ.get("DATABASE_URL", "")
USE_DB = bool(DATABASE_URL)

if USE_DB:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db = SQLAlchemy(app)

    class ProfileModel(db.Model):
        __tablename__ = "profile"
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(200), default="")
        title = db.Column(db.String(200), default="")
        bio = db.Column(db.Text, default="")
        email = db.Column(db.String(200), default="")
        github = db.Column(db.String(200), default="")
        linkedin = db.Column(db.String(200), default="")
        telegram = db.Column(db.String(200), default="")

    class SkillModel(db.Model):
        __tablename__ = "skills"
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(200), nullable=False)
        image = db.Column(db.Text, default="")
        date = db.Column(db.String(50), default="")
        icon = db.Column(db.String(50), default="")

    class ProjectModel(db.Model):
        __tablename__ = "projects"
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(500), default="")
        description = db.Column(db.Text, default="")
        date = db.Column(db.String(100), default="")
        tech = db.Column(db.Text, default="[]")
        image = db.Column(db.Text, default="")
        githubUrl = db.Column(db.Text, default="")
        liveUrl = db.Column(db.Text, default="")
        files = db.Column(db.Text, default="[]")

        def to_dict(self):
            return {
                "id": self.id,
                "title": self.title,
                "description": self.description,
                "date": self.date,
                "tech": json.loads(self.tech) if self.tech else [],
                "image": self.image or "",
                "githubUrl": self.githubUrl or "",
                "liveUrl": self.liveUrl or "",
                "files": json.loads(self.files) if self.files else [],
            }

    class ExperienceModel(db.Model):
        __tablename__ = "experience"
        id = db.Column(db.Integer, primary_key=True)
        role = db.Column(db.String(500), default="")
        company = db.Column(db.String(500), default="")
        period = db.Column(db.String(100), default="")
        description = db.Column(db.Text, default="")

    with app.app_context():
        db.create_all()
else:
    db = None

# ── JSON File Storage (fallback) ──
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

DEFAULT_PROFILE = {
    "name": "Bobur Abdurasulov",
    "title": "Full-Stack Developer",
    "bio": "Crafting premium digital experiences with modern web technologies.",
    "email": "hello@oasis.dev",
    "github": "https://github.com/bobur",
    "linkedin": "https://linkedin.com/in/bobur",
    "telegram": "https://t.me/Bobur_abdurasulov",
}

DEFAULT_SKILLS = []
DEFAULT_PROJECTS = []
DEFAULT_EXPERIENCE = []

def get_data(name, default):
    data = read_data(name)
    if data is None:
        write_data(name, default)
        return default
    return data

# ── Migration: JSON → PostgreSQL ──
def migrate_json_to_db():
    if not USE_DB:
        return
    with app.app_context():
        if ProfileModel.query.first() is None:
            profile = read_data("profile") or DEFAULT_PROFILE
            db.session.add(ProfileModel(**{k: v for k, v in profile.items() if k != "id"}))
        if SkillModel.query.first() is None:
            for s in read_data("skills") or DEFAULT_SKILLS:
                db.session.add(SkillModel(**{k: v for k, v in s.items() if k != "id"}))
        if ExperienceModel.query.first() is None:
            for e in read_data("experience") or DEFAULT_EXPERIENCE:
                db.session.add(ExperienceModel(**{k: v for k, v in e.items() if k != "id"}))
        if ProjectModel.query.first() is None:
            for p in read_data("projects") or DEFAULT_PROJECTS:
                item = {}
                for k, v in p.items():
                    if k in ("tech", "files"):
                        item[k] = json.dumps(v) if isinstance(v, (list, dict)) else v
                    elif k != "id":
                        item[k] = v
                db.session.add(ProjectModel(**item))
        db.session.commit()

migrate_json_to_db()

# ── DB helpers ──
def db_get_profile():
    if USE_DB:
        p = ProfileModel.query.first()
        if not p:
            return DEFAULT_PROFILE
        return {"name": p.name, "title": p.title, "bio": p.bio, "email": p.email,
                "github": p.github, "linkedin": p.linkedin, "telegram": p.telegram}
    return get_data("profile", DEFAULT_PROFILE)

def db_get_skills():
    if USE_DB:
        return [{"name": s.name, "image": s.image or "", "date": s.date or "", "icon": s.icon or ""}
                for s in SkillModel.query.all()]
    return get_data("skills", DEFAULT_SKILLS)

def db_get_projects():
    if USE_DB:
        return [p.to_dict() for p in ProjectModel.query.order_by(ProjectModel.id).all()]
    return get_data("projects", DEFAULT_PROJECTS)

def db_get_experience():
    if USE_DB:
        return [{"role": e.role, "company": e.company, "period": e.period, "description": e.description}
                for e in ExperienceModel.query.all()]
    return get_data("experience", DEFAULT_EXPERIENCE)

# ── Health ──
@app.route("/health")
@app.route("/api/health")
def health():
    return "ok", 200

# ── PUBLIC API ──
@app.route("/api/profile")
def get_profile():
    return jsonify(db_get_profile())

@app.route("/api/skills")
def get_skills():
    return jsonify(db_get_skills())

@app.route("/api/projects")
def get_projects():
    return jsonify(db_get_projects())

@app.route("/api/experience")
def get_experience():
    return jsonify(db_get_experience())

# ── ADMIN AUTH ──
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

# ── ADMIN: PROFILE ──
@app.route("/api/admin/profile", methods=["PUT"])
def admin_update_profile():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    if USE_DB:
        p = ProfileModel.query.first()
        if not p:
            p = ProfileModel()
            db.session.add(p)
        for k, v in data.items():
            if hasattr(p, k):
                setattr(p, k, v)
        db.session.commit()
        return jsonify({"ok": True, "data": db_get_profile()})
    else:
        current = get_data("profile", DEFAULT_PROFILE)
        current.update(data)
        write_data("profile", current)
        return jsonify({"ok": True, "data": current})

# ── ADMIN: SKILLS ──
@app.route("/api/admin/skills", methods=["PUT"])
def admin_update_skills():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    items = data.get("skills", [])
    if USE_DB:
        SkillModel.query.delete()
        for s in items:
            db.session.add(SkillModel(name=s.get("name", ""), image=s.get("image", ""),
                                       date=s.get("date", ""), icon=s.get("icon", "")))
        db.session.commit()
        return jsonify({"ok": True, "data": db_get_skills()})
    else:
        write_data("skills", items)
        return jsonify({"ok": True, "data": items})

# ── ADMIN: PROJECTS ──
@app.route("/api/admin/projects", methods=["POST"])
def admin_add_project():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    if USE_DB:
        max_id = db.session.query(db.func.max(ProjectModel.id)).scalar() or 0
        data["id"] = max_id + 1
        p = ProjectModel(
            id=data["id"],
            title=data.get("title", ""),
            description=data.get("description", ""),
            date=data.get("date", ""),
            tech=json.dumps(data.get("tech", [])),
            image=data.get("image", ""),
            githubUrl=data.get("githubUrl", ""),
            liveUrl=data.get("liveUrl", ""),
            files=json.dumps(data.get("files", [])),
        )
        db.session.add(p)
        db.session.commit()
        return jsonify({"ok": True, "data": p.to_dict()})
    else:
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
    if USE_DB:
        p = ProjectModel.query.get(pid)
        if not p:
            return jsonify({"ok": False, "error": "Not found"}), 404
        for k, v in data.items():
            if k == "tech":
                p.tech = json.dumps(v) if isinstance(v, list) else v
            elif k == "files":
                p.files = json.dumps(v) if isinstance(v, list) else v
            elif hasattr(p, k):
                setattr(p, k, v)
        db.session.commit()
        return jsonify({"ok": True, "data": p.to_dict()})
    else:
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
    if USE_DB:
        p = ProjectModel.query.get(pid)
        if p:
            db.session.delete(p)
            db.session.commit()
        return jsonify({"ok": True})
    else:
        projects = get_data("projects", DEFAULT_PROJECTS)
        projects = [p for p in projects if p.get("id") != pid]
        write_data("projects", projects)
        return jsonify({"ok": True})

# ── ADMIN: EXPERIENCE ──
@app.route("/api/admin/experience", methods=["POST"])
def admin_add_experience():
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    if USE_DB:
        e = ExperienceModel(role=data.get("role", ""), company=data.get("company", ""),
                            period=data.get("period", ""), description=data.get("description", ""))
        db.session.add(e)
        db.session.commit()
        return jsonify({"ok": True, "data": {"role": e.role, "company": e.company,
                                               "period": e.period, "description": e.description}})
    else:
        exp = get_data("experience", DEFAULT_EXPERIENCE)
        exp.append(data)
        write_data("experience", exp)
        return jsonify({"ok": True, "data": data})

@app.route("/api/admin/experience/<int:eid>", methods=["PUT"])
def admin_update_experience(eid):
    if not require_auth():
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
    data = request.get_json() or {}
    if USE_DB:
        e = ExperienceModel.query.get(eid + 1)
        if not e:
            return jsonify({"ok": False, "error": "Not found"}), 404
        for k, v in data.items():
            if hasattr(e, k):
                setattr(e, k, v)
        db.session.commit()
        return jsonify({"ok": True, "data": {"role": e.role, "company": e.company,
                                               "period": e.period, "description": e.description}})
    else:
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
    if USE_DB:
        e = ExperienceModel.query.get(eid + 1)
        if e:
            db.session.delete(e)
            db.session.commit()
        return jsonify({"ok": True})
    else:
        exp = get_data("experience", DEFAULT_EXPERIENCE)
        if eid < len(exp):
            exp.pop(eid)
            write_data("experience", exp)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": "Not found"}), 404

# ── FILE UPLOAD ──
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
    return jsonify({"ok": True, "url": f"/uploads/{name}", "name": f.filename, "is_image": is_image})

@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)

# ── Serve SPA routes ──
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