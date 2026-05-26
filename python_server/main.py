from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from skyfield.api import EarthSatellite, load
import requests
import datetime
import math
import asyncio
import time
import numpy as np
import sqlite3
import os
import ml_engine
from pydantic import BaseModel

app = FastAPI(title="Aerospace Intelligence Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to the local SQLite db
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'users.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            clearance_level TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            user_id INTEGER PRIMARY KEY,
            collision_threshold REAL,
            lookahead_hours REAL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            timestamp TEXT,
            primary_object TEXT,
            secondary_object TEXT,
            miss_distance REAL,
            relative_velocity REAL,
            risk_score REAL,
            urgency TEXT,
            status TEXT
        )
    """)
    cursor.execute("SELECT * FROM users WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (id, email, password, role, clearance_level) VALUES (1, 'admin@aerospace.gov', 'password123', 'COMMANDER', 'TOP_SECRET')")
        cursor.execute("INSERT INTO settings (user_id, collision_threshold, lookahead_hours) VALUES (1, 5.0, 24.0)")
    conn.commit()
    conn.close()

init_db()

ts = load.timescale()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

TLE_CACHE = []
LAST_FETCH = 0

def fetch_tle_data():
    global TLE_CACHE, LAST_FETCH
    if time.time() - LAST_FETCH < 3600 and TLE_CACHE:
        return TLE_CACHE

    url = "https://celestrak.org/NORAD/elements/gp.php?FORMAT=tle&GROUP=active"
    try:
        r = requests.get(url, timeout=10)
        lines = r.text.strip().split('\n')
        satellites = []
        for i in range(0, len(lines)-2, 3):
            name = lines[i].strip()
            line1 = lines[i+1].strip()
            line2 = lines[i+2].strip()
            satellites.append({
                "name": name,
                "line1": line1,
                "line2": line2
            })
        TLE_CACHE = satellites
        LAST_FETCH = time.time()
        return satellites
    except Exception as e:
        print(f"Error fetching TLEs: {e}")
        return TLE_CACHE

def get_admin_settings():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'users.db')
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # Fetch the admin settings (assuming user_id 1 is admin)
        cursor.execute("SELECT collision_threshold FROM settings WHERE user_id = 1")
        row = cursor.fetchone()
        conn.close()
        if row:
            return float(row[0])
    except Exception as e:
        print(f"Error reading DB settings: {e}")
    return 5.0  # fallback to 5km critical threshold

def calculate_conjunctions():
    raw_sats = fetch_tle_data()
    # Scale up to 500 satellites instead of 50
    demo_sats = raw_sats[:500]
    
    skyfield_sats = []
    valid_names = []
    for s in demo_sats:
        try:
            sat = EarthSatellite(s["line1"], s["line2"], s["name"], ts)
            skyfield_sats.append(sat)
            valid_names.append(s["name"])
        except:
            pass

    t = ts.now()
    alerts = []
    
    # Pre-calculate all positions (Nx3 matrix)
    positions = []
    for sat in skyfield_sats:
        positions.append(sat.at(t).position.km)
        
    positions = np.array(positions)
    
    # Get dynamic threshold
    critical_threshold_km = get_admin_settings()
    warning_threshold_km = critical_threshold_km * 5.0 # Alert if within 5x critical
    
    if len(positions) > 1:
        n = len(positions)
        diff = positions[:, np.newaxis, :] - positions[np.newaxis, :, :]
        dist_sq = np.sum(diff**2, axis=-1)
        
        i_idx, j_idx = np.triu_indices(n, k=1)
        distances_sq_triu = dist_sq[i_idx, j_idx]
        
        # Filter where distance squared < (warning_threshold_km)^2
        close_pairs = np.where(distances_sq_triu < warning_threshold_km**2)[0]
        
        for idx in close_pairs:
            i = i_idx[idx]
            j = j_idx[idx]
            dist = math.sqrt(distances_sq_triu[idx])
            sat1 = skyfield_sats[i]
            sat2 = skyfield_sats[j]
            
            miss_distance = round(dist * 1000)
            time_to_impact = int(dist / 7.0)
            base_prob = round((warning_threshold_km - dist) / warning_threshold_km, 2)
            
            # Predict Risk using ML
            ai_risk = ml_engine.get_risk_prediction(miss_distance, time_to_impact)
            
            alerts.append({
                "id": f"C-{sat1.model.satnum}-{sat2.model.satnum}",
                "primaryObject": sat1.name,
                "primaryNorad": str(sat1.model.satnum),
                "secondaryObject": sat2.name,
                "secondaryNorad": str(sat2.model.satnum),
                "missDistance": miss_distance, # in meters
                "timeToImpact": time_to_impact,
                "probability": base_prob,
                "aiRiskScore": round(ai_risk * 100, 1),
                "urgency": "CRITICAL" if dist < critical_threshold_km else "HIGH"
            })

    alerts.sort(key=lambda x: x["missDistance"])
    return {"status": "success", "count": len(alerts), "alerts": alerts[:10]}

# Legacy REST endpoint
@app.get("/api/conjunctions")
def get_conjunctions():
    return calculate_conjunctions()

# New WebSocket endpoint
@app.websocket("/ws/conjunctions")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial data instantly
        await websocket.send_json(calculate_conjunctions())
        
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task to broadcast to all clients every 5 seconds
async def physics_broadcaster():
    while True:
        await asyncio.sleep(5)
        if manager.active_connections:
            data = calculate_conjunctions()
            await manager.broadcast(data)

@app.on_event("startup")
async def startup_event():
    # Train the ML model on startup if data exists
    ml_engine.train_model()
    asyncio.create_task(physics_broadcaster())

# --- NEW API ROUTES MIGRATED FROM NEXT.JS ---

class AlertPayload(BaseModel):
    id: str
    primaryObject: str
    primaryNorad: str
    secondaryObject: str
    secondaryNorad: str
    missDistance: float
    timeToImpact: float
    probability: float

@app.get("/api/alerts")
def get_alerts():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50')
        rows = cursor.fetchall()
        alerts = [dict(row) for row in rows]
        conn.close()
        return {"success": True, "alerts": alerts}
    except Exception as e:
        print("Error fetching alerts:", e)
        return {"error": "Internal Server Error"}, 500

@app.post("/api/alerts")
def create_alert(alert: AlertPayload):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR IGNORE INTO alerts 
            (id, primaryObject, primaryNorad, secondaryObject, secondaryNorad, missDistance, timeToImpact, probability) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (alert.id, alert.primaryObject, alert.primaryNorad, alert.secondaryObject, alert.secondaryNorad, alert.missDistance, alert.timeToImpact, alert.probability))
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        print("Error saving alert:", e)
        return {"error": "Internal Server Error"}, 500

class SettingsPayload(BaseModel):
    collision_threshold: int
    lookahead_hours: int = 24

@app.get("/api/settings")
def get_settings():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        # Default to user_id 'admin'
        cursor.execute("SELECT collision_threshold, lookahead_hours FROM settings WHERE user_id = 'admin'")
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"success": True, "settings": dict(row)}
        return {"success": True, "settings": {"collision_threshold": 10, "lookahead_hours": 24}}
    except Exception as e:
        print("Error fetching settings:", e)
        return {"error": "Internal Server Error"}, 500

@app.post("/api/settings")
def update_settings(settings: SettingsPayload):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO settings (user_id, collision_threshold, lookahead_hours) 
            VALUES ('admin', ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET 
            collision_threshold=excluded.collision_threshold,
            lookahead_hours=excluded.lookahead_hours
        ''', (settings.collision_threshold, settings.lookahead_hours))
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        print("Error saving settings:", e)
        return {"error": "Internal Server Error"}, 500

# --- SATELLITE CATALOG ENDPOINT ---

@app.get("/api/satellites")
def get_satellites():
    """Return TLE data for the frontend 3D globe to propagate orbits."""
    raw_sats = fetch_tle_data()
    catalog = []
    for s in raw_sats:
        try:
            sat = EarthSatellite(s["line1"], s["line2"], s["name"], ts)
            catalog.append({
                "name": s["name"],
                "noradId": str(sat.model.satnum),
                "line1": s["line1"],
                "line2": s["line2"],
                "type": "PAYLOAD"
            })
        except:
            pass
    
    # Return up to 1500 satellites so the globe looks busy but doesn't crash the browser
    return {"data": catalog[:1500]}

# --- AUTH ENDPOINTS ---

class LoginPayload(BaseModel):
    email: str
    password: str

class RegisterPayload(BaseModel):
    email: str
    password: str
    role: str = "operator"
    clearance_level: str = "standard"

@app.post("/api/auth/login")
def login(payload: LoginPayload):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE email = ?", (payload.email,))
        row = cursor.fetchone()
        conn.close()
        if row and row[0] == payload.password:
            return {"success": True, "message": "Authenticated"}
        return {"error": "Invalid credentials"}, 401
    except Exception as e:
        print("Login error:", e)
        return {"error": "Internal Server Error"}, 500

@app.post("/api/auth/register")
def register(payload: RegisterPayload):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password, role, clearance_level) VALUES (?, ?, ?, ?)",
            (payload.email, payload.password, payload.role, payload.clearance_level)
        )
        conn.commit()
        conn.close()
        return {"success": True, "message": f"Officer {payload.email} registered."}
    except sqlite3.IntegrityError:
        return {"error": "User already exists"}, 409
    except Exception as e:
        print("Register error:", e)
        return {"error": "Internal Server Error"}, 500

