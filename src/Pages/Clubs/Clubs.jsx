import { useEffect, useMemo, useState } from "react";
import { updateField } from "../../Tools/Updators/Updators.jsx";
import { getClubs } from "../../Tools/MockAPI/FakeAPI.jsx";
import "./Clubs.css";
import { Link } from "react-router-dom";

function formatClubs(clubsList, user) {
    return (clubsList ?? []).map(club => ({
        ...club,
        memberCount: club.users.length,
        isMember: user ? club.users.map(u => u.id).includes(user?.id) : false,
        isAdmin: user ? club.admins.map(a => a.id).includes(user?.id) : false
    }));
}

function Clubs({ clubs, user }) {
    const [clubsLoading, setClubsLoading] = useState(false);
    
    useEffect(() => {
        updateField(clubs.clubs, clubs.setClubs, setClubsLoading, getClubs);
    }, [clubs, clubs.clubs]);
    
    const formattedClubs = useMemo(() => {
        return formatClubs(clubs.clubs, user?.user);
    }, [clubs.clubs, user]);
    
    return (
        <>
            <section className="clubs-hero">
                <div className="clubs-hero-content">
                    <div className="clubs-eyebrow">Campus Clubs</div>

                    <h1 className="clubs-title">
                        Find your
                        <br />
                        <em>community.</em>
                    </h1>

                    <p className="clubs-subtitle">
                        Explore student organizations, see how many members each club has,
                        and keep track of the clubs you've joined.
                    </p>
                </div>
            </section>

            <section className="clubs-section">
                {clubsLoading ? (
                    <div className="clubs-loading">Loading clubs...</div>
                ) : (
                    <div className="clubs-grid">
                        {formattedClubs.map(club => (
                            <Link to={`/clubs/${club.id}`} key={club.id} className="club-card">
                                <div className="club-card-header">
                                    <h2 className="club-card-title">{club.name}</h2>

                                    {club.isMember && (
                                        <span className={"club-badge " + (club.isAdmin ? "admin" : "member")}>
                                            {club.isAdmin ? "Admin" : "Member"}
                                        </span>
                                    )}
                                </div>

                                <div className="club-card-divider" />

                                <div className="club-card-footer">
                                    <span>Members</span>
                                    <strong>{club.memberCount}</strong>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default Clubs;