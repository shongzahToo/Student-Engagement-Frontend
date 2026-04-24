import { useEffect, useState } from "react";
import "./Leaderboard.css";
import { getUsers } from "../../Tools/MockAPI/FakeAPI";
import { updateField } from "../../Tools/Updators/Updators.jsx";

function Leaderboard({ user, users }) {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        updateField(users.users, users.setUsers, setLoading, getUsers);
    }, [users, users.users]);

    return (
        <section className="leaderboard-page">
            <div className="leaderboard-header">
                <div className="leaderboard-eyebrow">Campus Points</div>
                <h1 className="leaderboard-title">Leaderboard</h1>
                <p className="leaderboard-subtitle">
                    See who has earned the most points from attending events, RSVPing, and getting involved on campus.
                </p>
            </div>

            {loading ? (
                <div className="leaderboard-empty">Loading leaderboard...</div>
            ) : (
                <div className="leaderboard-card">
                    <div className="leaderboard-list-header">
                        <span>Rank</span>
                        <span>User</span>
                        <span>Points</span>
                    </div>

                    {users.users?.map((leaderboardUser, index) => (
                        <div key={leaderboardUser.id} className={"leaderboard-row" + (user && leaderboardUser.id === user.id ? " current-user" : "")} >
                            <div className={"leaderboard-rank" + (index === 0 ? " first" : index === 1 ? " second" : index === 2 ? " third" : "")}>#{index + 1}</div>

                            <div className="leaderboard-user">
                                <div className="leaderboard-avatar">
                                    {leaderboardUser.username.split(" ").slice(0, 2).map(word => word[0]?.toUpperCase()).join("")}
                                </div>
                                <div>
                                    <div className="leaderboard-name">
                                        {leaderboardUser.username}
                                        {user && leaderboardUser.id === user.id ? (<span className="you-label">You</span>) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="leaderboard-points">
                                <span className="coin">🪙</span>
                                {leaderboardUser.points} pts
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Leaderboard;