# OASIS — Futuristic Digital Portfolio

Premium full-stack development agency portfolio website.

## Quick Start

### Frontend (React + Next.js)
**Double-click** `start.bat` yoki terminalda:

```bash
npm install
npm run dev
```

**Open:** http://localhost:3000

### Backend (Python FastAPI)
**Double-click** `start-backend.bat` yoki terminalda:

```bash
cd backend
pip install -r requirements.txt
python run.py
```

**API:** http://localhost:8000

## Admin Panel

**URL:** http://localhost:3000/admin/login  
**Login:** `admin` / `oasis2024`

## Project Structure

```
oasis-portfolio/
├── src/                    # React Frontend (Next.js 14)
│   ├── app/                # Pages & Layouts
│   ├── components/         # UI Components
│   │   ├── 3d/             # Three.js 3D Scene
│   │   └── ...             # Section Components
├── backend/                # Python FastAPI Backend
│   ├── app/
│   │   ├── admin.py        # ★ Admin Panel API
│   │   ├── models/         # Database Models
│   │   ├── routes/         # API Routes
│   │   └── schemas/        # Validators
├── public/images/          # Logo & Assets
├── start.bat              # Frontend start
└── start-backend.bat      # Backend start
```

## Tech Stack

- **Frontend:** Next.js, React, Three.js, Framer Motion, GSAP, Tailwind CSS
- **Backend:** Python, FastAPI, PostgreSQL, SQLAlchemy, JWT
