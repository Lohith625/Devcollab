import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("userId", res.data._id);

      alert("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="pill">
            <span className="pill-dot" />
            Live collaborative editor
          </div>
          <h1 className="auth-title">
            Welcome back to <span className="auth-highlight">DevCollab</span>
          </h1>
          <p className="auth-subtitle">
            Hop into your rooms, pair program in real‑time, and ship better code together.
            Stay in sync with live code, chat, and shared snippets.
          </p>
          <div className="auth-badges">
            <span className="auth-badge">Realtime code sync</span>
            <span className="auth-badge">Room‑based sessions</span>
            <span className="auth-badge">Snippet history</span>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-heading">Sign in</h2>
            <p className="auth-caption">
              Use your DevCollab account to access your rooms.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
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
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-actions">
              <button type="submit">Continue to dashboard</button>
              <div className="auth-secondary">
                New to DevCollab?{" "}
                <Link to="/register">
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;