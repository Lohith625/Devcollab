import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link } from "react-router-dom";

function Register() {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ username,email,password });
      alert("Account created");
    } catch(error){
      alert(`Registration failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="pill">
            <span className="pill-dot" />
            Create your workspace
          </div>
          <h1 className="auth-title">
            Set up your <span className="auth-highlight">DevCollab</span> account
          </h1>
          <p className="auth-subtitle">
            Pick a username, invite teammates into rooms, and start collaborating on code
            with a shared editor, chat, and snippets.
          </p>
          <div className="auth-badges">
            <span className="auth-badge">Designed for pair programming</span>
            <span className="auth-badge">Built for teaching & demos</span>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-heading">Create account</h2>
            <p className="auth-caption">
              Just a few details to get you into your first room.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="input-control"
                placeholder="Choose a display name"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-control"
                placeholder="Create a secure password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-actions">
              <button type="submit">Create account</button>
              <div className="auth-secondary">
                Already using DevCollab?{" "}
                <Link to="/">Sign in instead</Link>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Register;