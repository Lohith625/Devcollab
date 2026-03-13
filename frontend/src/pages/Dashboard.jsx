import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const API = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:5000/api",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  const fetchRooms = useCallback(async () => {
    const res = await API.get("/rooms");
    return res.data;
  }, [API]);

  const createRoom = async () => {
    try {
      await API.post("/rooms", { name: roomName });
      setRoomName("");
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchRooms();
        if (!cancelled) setRooms(data);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchRooms]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="brand">
            <div className="brand-mark" />
            <div className="brand-text">
              <span className="brand-name">DevCollab</span>
              <span className="brand-tagline">Your real‑time coding studio</span>
            </div>
          </div>
          <div className="pill">
            <span className="pill-dot" />
            Signed in as {localStorage.getItem("username") || "Guest"}
          </div>
        </header>

        <main className="dashboard-main">
          <section className="dashboard-card">
            <h2>Create a new room</h2>
            <p>
              Spin up a collaborative coding room for interviews, pair programming, or
              live debugging sessions. Share the link with your teammates.
            </p>

            <div className="room-form">
              <div className="room-input-row">
                <input
                  className="room-input"
                  type="text"
                  placeholder="Name your room (e.g. Live Debug with Alex)"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <button type="button" onClick={createRoom}>
                  Create room
                </button>
              </div>
              <div className="auth-badges">
                <span className="auth-badge">Shared editor</span>
                <span className="auth-badge">Inline chat</span>
                <span className="auth-badge">Executable snippets</span>
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <h3>Available rooms</h3>
            <p>Join an existing room to see live code and chat in real‑time.</p>

            <div className="room-list">
              {rooms.length === 0 && (
                <span className="room-id">No rooms yet — create one to get started.</span>
              )}

              {rooms.map((room) => (
                <div key={room._id} className="room-card">
                  <div className="room-meta">
                    <span className="room-name">{room.name}</span>
                    <span className="room-id">#{room._id}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/room/${room._id}`)}
                  >
                    Join room
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;