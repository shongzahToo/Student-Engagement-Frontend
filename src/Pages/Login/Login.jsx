import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../Tools/MockAPI/FakeAPI";
import { updateField } from "../../Tools/Updators/Updators.jsx";
import "./Login.css";

function Login({ users, setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        updateField(users.users, users.setUsers, setLoading, getUsers);
    }, [users, users.users]);

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-eyebrow">Temporary Login</div>
          <h1 className="login-title">Choose a test user</h1>
          <p className="login-subtitle">
            Select one of the test accounts below to preview the site as that user.
          </p>
        </div>

        {loading ? (
          <div className="login-empty">Loading users...</div>
        ) : (
          <div className="user-select-list">
            {users?.users?.map(u => (
              <button key={u.id} className="user-select-row" onClick={() => {
                  setUser(u);
                  navigate("/");
                }}>
                <div className="user-select-avatar">
                  {u.username.split(" ").slice(0, 2).map(word => word[0]?.toUpperCase()).join("")}
                </div>

                <div className="user-select-info">
                  <div className="user-select-name">{u.username}</div>
                  <div className="user-select-id">Test User #{u.id}</div>
                </div>

                <div className="user-select-points">
                  <span className="coin">🪙</span>
                  {u.points} pts
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;