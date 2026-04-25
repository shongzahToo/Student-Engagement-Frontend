import { useEffect, useState } from "react";
import "./Leaderboard.css";
import { updateField } from "../../Tools/Updator.jsx";
import { getUsers } from "../../Tools/controller.jsx";

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
                    {users.users?.sort((a, b) => b.points - a.points).map((leaderboardUser, index) => (
                        <div key={leaderboardUser.id} className={"leaderboard-row" + (user && leaderboardUser.id === user.id ? " current-user" : "")} >
                            <div className={"leaderboard-rank" + (index === 0 ? " first" : index === 1 ? " second" : index === 2 ? " third" : "")}>#{index + 1}</div>
                            <div className="leaderboard-user">
                                <div className="leaderboard-avatar">
                                    {leaderboardUser?.name?.split(" ")?.slice(0, 2)?.map(word => word[0]?.toUpperCase()).join("")}
                                </div>
                                <div>
                                    <div className="leaderboard-name">
                                        {leaderboardUser.name}
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