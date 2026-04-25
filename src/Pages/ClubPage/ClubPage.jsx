import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import formatDate from "../../Tools/FormatDate";
import { approveUserJoinClub, userJoinClub, getClubById } from "../../Tools/controller.jsx";
import "./ClubPage.css";

function ClubPage({ user }) {
    const { id } = useParams();

    const [club, setClub] = useState(null);
    const [memberSort, setMemberSort] = useState("points");
    const [isLoading, setIsLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(null);

    useEffect(() => {
        const fetchClub = async () => {
            const foundClub = await getClubById(id);
            setClub(foundClub);
            setIsLoading(false);
        };
        fetchClub();
    }, [id]);

    if (isLoading) {
        return <div className="club-page-not-found"><div className="club-page-loading">Loading...</div></div>;
    }

    if (!club) {
        return (
            <div className="club-page-not-found">
                <h2>Club not found</h2>
                <Link to="/clubs">Back to all clubs</Link>
            </div>
        );
    }

    const currentUser = user?.user;
    const adminIds = club.users.filter(u => u.admin).map(a => a.id);
    const memberIds = club.users.map(u => u.id);
    const pendingIds = (club.pendingRequests ?? []).map(u => u.id);

    const isAdmin = currentUser ? (currentUser.type == "admin" ? true : adminIds.includes(currentUser.id)) : false;
    const isMember = currentUser ? (currentUser.type == "admin" ? true : memberIds.includes(currentUser.id)) : false;
    const hasPendingRequest = currentUser ? pendingIds.includes(currentUser.id) : false;

    async function handleJoin() {
        setActionBusy("self");
        const updated = await userJoinClub(club.id, currentUser.id);
        setClub(updated);
        setActionBusy(null);
    }

    async function handleCancelRequest() {
        setActionBusy("self");
        const updated = await userJoinClub(club.id, currentUser.id);
        setClub(updated);
        setActionBusy(null);
    }

    async function handleLeave() {
        setActionBusy("self");
        const updated = await userJoinClub(club.id, currentUser.id);
        setClub(updated);
        setActionBusy(null);
    }

    async function handleApprove(userId) {
        setActionBusy(userId);
        const updated = await approveUserJoinClub(club.id, userId, user?.user.id);
        setClub(updated);
        setActionBusy(null);
    }

    async function handleRemove(userId) {
        setActionBusy(userId);
        const updated = await userJoinClub(club.id, userId);
        setClub(updated);
        setActionBusy(null);
    }

    const sortMembers = members => {
        return [...members].sort((a, b) => {
            if (memberSort === "name") return (a.name || a.name).localeCompare(b.name || b.name);
            if (memberSort === "status") return (a.status || "Member").localeCompare(b.status || "Member");
            return (b.points || 0) - (a.points || 0);
        });
    };

    const regularMembers = club.users.filter(u => !u.admin);
    const sortedMembers = [...sortMembers(club.users.filter(u => u.admin)), ...sortMembers(regularMembers)];
    const pendingRequests = club.pendingRequests ?? [];

    return (
        <div className="club-page">
            <Link to="/clubs">← See all clubs</Link>

            <div className="club-page-header">
                <div className="club-page-header-left">
                    <h1>{club.name}</h1>
                    <p>{club.description}</p>
                    <p><strong>Total Members:</strong> {club.users.length}</p>
                </div>

                {currentUser && (
                    <div className="club-page-membership">
                        {isMember && (
                            <span className={"club-badge " + (isAdmin ? "admin" : "member")}>
                                {isAdmin ? "Admin" : "Member"}
                            </span>
                        )}
                        {hasPendingRequest && (
                            <span className="club-badge pending">Request Pending</span>
                        )}

                        {!isMember && !hasPendingRequest && (
                            <button
                                className="membership-btn join"
                                disabled={actionBusy === "self"}
                                onClick={handleJoin}
                            >
                                {actionBusy === "self" ? "Requesting…" : "Request to Join"}
                            </button>
                        )}

                        {!isMember && hasPendingRequest && (
                            <button
                                className="membership-btn cancel-request"
                                disabled={actionBusy === "self"}
                                onClick={handleCancelRequest}
                            >
                                {actionBusy === "self" ? "Cancelling…" : "Cancel Request"}
                            </button>
                        )}

                        {isMember && (
                            <button
                                className="membership-btn leave"
                                disabled={actionBusy === "self"}
                                onClick={handleLeave}
                            >
                                {actionBusy === "self" ? "Leaving…" : "Leave Club"}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isAdmin && pendingRequests.length > 0 && (
                <div className="club-section">
                    <h2 className="club-section-heading">
                        Join Requests
                        <span className="section-count">{pendingRequests.length}</span>
                    </h2>

                    <div className="club-member-card">
                        {pendingRequests.map(u => (
                            <div key={u.id} className="club-member-row pending-row">
                                <div className="club-member-user">
                                    <div className="club-member-avatar">
                                        {(u.name || "?")
                                            .split(" ").slice(0, 2)
                                            .map(w => w[0]?.toUpperCase()).join("")}
                                    </div>
                                    <div className="club-member-name">
                                        {u.name || `User #${u.id}`}
                                    </div>
                                </div>
                                <div className="club-member-admin-actions">
                                    <button
                                        className="admin-btn approve"
                                        disabled={actionBusy === u.id}
                                        onClick={() => handleApprove(u.id)}
                                    >
                                        {actionBusy === u.id ? "…" : "Admit"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isMember ? (
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
                            {isAdmin && <span></span>}
                        </div>

                        {sortedMembers.map(member => {
                            const memberIsAdmin = adminIds.includes(member.id);
                            const isCurrentUser = currentUser && member.id === currentUser.id;

                            return (
                                <div
                                    key={member.id}
                                    className={
                                        "club-member-row" +
                                        (isCurrentUser ? " current-user" : "") +
                                        (memberIsAdmin ? " admin-user" : "")
                                    }
                                >
                                    <div className="club-member-status">
                                        {memberIsAdmin ? "Admin" : member.status || "Member"}
                                    </div>

                                    <div className="club-member-user">
                                        <div className="club-member-avatar">
                                            {(member.name || member.name || "?")
                                                .split(" ").slice(0, 2)
                                                .map(w => w[0]?.toUpperCase()).join("")}
                                        </div>
                                        <div className="club-member-name">
                                            {member.name || member.name}
                                            {isCurrentUser && <span className="you-label">You</span>}
                                            {memberIsAdmin && <span className="admin-label">Admin</span>}
                                        </div>
                                    </div>

                                    <div className="club-member-points">
                                        <span className="coin">🪙</span>
                                        {member.points || 0} pts
                                    </div>

                                    {isAdmin && !isCurrentUser && (
                                        <div className="club-member-admin-actions">
                                            <button
                                                className="admin-btn remove"
                                                disabled={actionBusy === member.id}
                                                onClick={() => handleRemove(member.id)}
                                            >
                                                {actionBusy === member.id ? "…" : "Remove"}
                                            </button>
                                        </div>
                                    )}

                                    {isAdmin && isCurrentUser && (
                                        <div className="club-member-admin-actions" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="members-private">
                    Join this club to see its members.
                </p>
            )}

            <div className="club-section">
                <div className="events-header-section">
                    <h2>Hosted Events</h2>
                </div>

                {club.events.filter(e => e.status === 3).length > 0 ? (
                    <div className="event-list">
                        {club.events.filter(e => e.status === 3).map(event => (
                            <Link to={`/events/${event.id}`} className="event-card" key={event.id}>
                                <h3>{event.name}</h3>
                                <p>{formatDate(event.dateTime)}</p>
                                <p>{event.location}</p>
                                <span className="badge">{event.tag}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>This club is not hosting any events yet.</p>
                )}

                {isAdmin && (
                    <>
                        <div className="events-header-section" style={{ marginTop: "1.5rem" }}>
                            <h2>Event Drafts</h2>
                            <Link to={`/clubs/${club.id}/create-event`} className="create-event-button">
                                Create New Event Draft
                            </Link>
                        </div>

                        {club.events.filter(e => e.status !== 3).length > 0 ? (
                            <div className="event-list">
                                {club.events.filter(e => e.status !== 3).map(event => (
                                    <Link to={`/events/${event.id}`} className="event-card" key={event.id}>
                                        <h3>{event.name}</h3>
                                        <p>{formatDate(event.dateTime)}</p>
                                        <p>{event.location}</p>
                                        <span className="badge">{event.tag}</span>
                                        <span className="badge">{['Draft', 'Submitted', 'Approved', 'live', 'Completed'][event.status]}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p>No event drafts.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ClubPage;
