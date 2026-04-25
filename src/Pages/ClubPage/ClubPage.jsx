import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClubById } from "../../Tools/MockAPI/FakeAPI";
import "./ClubPage.css";

function ClubPage({ user }) {
    const { id } = useParams();

    const [club, setClub] = useState(null);
    const [isClubMember, setIsClubMember] = useState(false);
    const [memberSort, setMemberSort] = useState("points");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClub = async () => {
            const foundClub = await getClubById(id);
            setClub(foundClub);
            setIsLoading(false);
        };
        fetchClub();
    }, [club, id]);


    useEffect(() => {
        if (club && user?.user?.id) {
            setIsClubMember(
                club.users.map(u => u.id).includes(user.user.id)
            );
        }
    }, [club, user]);

    if (isLoading) {
        return <div className="club-page-not-found"><div className="club-page-loading">Loading...</div></div>;
    } else if (!club) {
        return (
            <div className="club-page-not-found">
                <h2>Club not found</h2>
                <Link to="/clubs">Back to all clubs</Link>
            </div>
        );
    } else {
        const regularMembers = club?.users?.filter(member =>
            !club.admins.map(a => a.id).includes(member.id)
        );

        const sortMembers = members => {
            return [...members].sort((a, b) => {
                if (memberSort === "name") {
                    return (a.username || a.name).localeCompare(b.username || b.name);
                }

                if (memberSort === "status") {
                    return (a.status || "Member").localeCompare(b.status || "Member");
                }

                return (b.points || 0) - (a.points || 0);
            });
        };

        const sortedMembers = [...sortMembers(club.admins), ...sortMembers(regularMembers)];
        return (
            <div className="club-page">
                <Link to="/clubs">← See all clubs</Link>

                <h1>{club.name}</h1>
                <p>{club.description}</p>

                <p>
                    <strong>Total Members:</strong> {club.users.length}
                </p>

                {isClubMember ? (
                    <div className="club-section">
                        <div className="club-members-header">
                            <h2>Members</h2>

                            <select
                                className="club-sort-select"
                                value={memberSort}
                                onChange={e => setMemberSort(e.target.value)}
                            >
                                <option value="points">Sort by Points</option>
                                <option value="name">Sort by Name</option>
                                <option value="status">Sort by Status</option>
                            </select>
                        </div>

                        <div className="club-member-card">
                            <div className="club-member-list-header">
                                <span>Status</span>
                                <span>User</span>
                                <span>Points</span>
                            </div>

                            {sortedMembers.map(member => {
                                const isAdmin = club.admins.some(admin => admin.id === member.id);
                                const isCurrentUser = user?.user && member.id === user.user.id;

                                return (
                                    <div
                                        key={member.id}
                                        className={
                                            "club-member-row" +
                                            (isCurrentUser ? " current-user" : "") +
                                            (isAdmin ? " admin-user" : "")
                                        }
                                    >
                                        <div className="club-member-status">
                                            {isAdmin ? "Admin" : member.status || "Member"}
                                        </div>

                                        <div className="club-member-user">
                                            <div className="club-member-avatar">
                                                {member.username
                                                    .split(" ")
                                                    .slice(0, 2)
                                                    .map(word => word[0]?.toUpperCase())
                                                    .join("")}
                                            </div>

                                            <div className="club-member-name">
                                                {member.username}

                                                {isCurrentUser ? (
                                                    <span className="you-label">You</span>
                                                ) : null}

                                                {isAdmin ? (
                                                    <span className="admin-label">Admin</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="club-member-points">
                                            <span className="coin">🪙</span>
                                            {member.points || 0} pts
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : ( null )}

                <div className="club-section">
                    <div className="events-header-section">
                        <h2>Hosted Events</h2>
                    </div>

                    {club.events.filter(e => e.stage == 3).length > 0 ? (
                        <div className="event-list">
                            {club.events.map(event => (
                                <Link to={`/events/${event.id}`} className="event-card" key={event.id} >
                                    <h3>{event.name}</h3>
                                    <p>{event.date} at {event.time}</p>
                                    <p>{event.location}</p>
                                    <span className="badge">{event.tag}</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>This club is not hosting any events yet.</p>
                    )}
                    <div className="events-header-section">
                        <h2>Event Drafts</h2>
                        {club.admins.map(a => a.id).includes(user?.user?.id) && (
                            <Link to={`/clubs/${club.id}/create-event`} className="create-event-button">
                                Create New Event Draft
                            </Link>
                        )}
                    </div>
                    {club.events.filter(e => e.stage != 3).length > 0 && club.admins.map(a => a.id).includes(user?.user?.id) && (
                        <div className="event-list">
                            {club.events.filter(e => e.stage != 3).map(event => (
                                <Link to={`/events/${event.id}`} className="event-card" key={event.id} >
                                    <h3>{event.name}</h3>
                                    <p>{event.date} at {event.time}</p>
                                    <p>{event.location}</p>
                                    <span className="badge">{event.tag}</span>
                                    <span className="badge">{['Draft', 'Submitted', 'Approved', 'Completed'][event.stage]}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ClubPage;