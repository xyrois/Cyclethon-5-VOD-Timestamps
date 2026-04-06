# Cyclethon 5 Timestamps

A fan-made site for Connor's Cyclethon charity stream, browse VODs, and jump to timestamps. All donations go to the Immune Deficiency Foundation.

🔗 [Donate on Tiltify](https://tilt.fyi/EMmt5WmPFh)

---

## Stack

- **Frontend** — React + Vite + React Router
- **Backend** — FastAPI (Python)
- **Database** — PostgreSQL
- **Deployment** — Vercel + Render

---

## Project Structure

```
cyclethon-vod-tool/
├── backend/
│   ├── routes/
│   │   ├── vods.py
│   │   └── timestamps.py
│   ├── create_db.py
│   ├── database.py
│   ├── main.py
│   └── models.py
└── frontend/
    └── src/
        ├── components/
        │   ├── Nav.jsx
        │   └── TwitchPlayer.jsx
        └── pages/
            ├── HomePage.jsx
            ├── VodPage.jsx
            └── ClipsPage.jsx
```

---

## Local Development

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv httpx
```

Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cyclethon
ADMIN_KEY=your-secret-key
TILTIFY_CLIENT_ID=your-tiltify-client-id
TILTIFY_CLIENT_SECRET=your-tiltify-client-secret
```

Create the tables then start the server:
```bash
python3 create_db.py
uvicorn main:app --reload
```

API runs at `http://localhost:8000` — docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_ADMIN_KEY=your-secret-key
VITE_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Adding Content

### Add a VOD
Post to the API via the Swagger UI at `/docs` or curl:
```bash
curl -X POST http://localhost:8000/api/vods \
  -H "Content-Type: application/json" \
  -d '{"vod_id": "2740154602", "title": "Cyclethon Day 1"}'
```

### Add Clips
Edit `frontend/src/pages/ClipsPage.jsx` and fill in the `CLIPS` array:
```js
const CLIPS = [
  { title: "Clip title", videoId: "YOUTUBE_VIDEO_ID" },
];
```

---

## Admin

Timestamps can only be added or deleted by whoever has the `ADMIN_KEY`. The add/delete UI is hidden from viewers automatically — it only appears when `VITE_ADMIN_KEY` is set in the frontend `.env`.

---
