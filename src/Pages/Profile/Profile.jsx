import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { updateField } from "../../Tools/Updators/Updators.jsx";
import { getClubs, getEvents } from "../../Tools/MockAPI/FakeAPI";
import "./Profile.css";

function Profile({ user = null, events, clubs }) {
    const [eventsLoading, setEventsLoading] = useState(events.events === null);
    const [clubsLoading, setClubsLoading] = useState(clubs.clubs === null);

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);
    
    useEffect(() => {
        updateField(clubs.clubs, clubs.setClubs, setClubsLoading, getClubs);
    }, [clubs, clubs.clubs]);

    if (user.user === null) {
        return <Navigate to="/login" />;
    }

    const userEvents = events?.events?.filter(event => event.users.includes(user.user.id));
    const userClubs = clubs?.clubs?.filter(club => club.users.map(u => u.id).includes(user.user.id));

    return (
        <div className="profile-layout">
            <div className="profile-main">
                <div className="profile-top">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {user.user.username.split(" ").slice(0, 2).map(word => word[0].toUpperCase()).join("")}
                        </div>

                        <div className="profile-details">
                            <div className="profile-username">{user.user.username}</div>
                            <div className="profile-points">
                                <span className="coin">🪙</span>
                                {user.user.points} pts
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-events">
                    <h2>My Events</h2>
                    {eventsLoading ? (
                        <div className="profile-page">Loading Events...</div>
                    ) : userEvents.length === 0 ? (
                        <p>You have not RSVP'd to any events yet. Click <Link to="/events">here</Link> to browse events and get involved on campus!</p>
                    ) : (
                        <div className="profile-event-list">
                            {userEvents.map(event => (
                                <Link to={`/events/${event.id}`} key={event.id} className="profile-event-card">
                                    <div className="profile-event-name">{event.name}</div>
                                    <div className="profile-event-meta">
                                        {event.date} at {event.time}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-events">
                    <h2>My Clubs</h2>
                    {clubsLoading ? (
                        <div className="profile-page">Loading Clubs...</div>
                    ) : userClubs.length === 0 ? (
                        <p>You have not joined any clubs yet. Click <Link to="/clubs">here</Link> to browse clubs and get involved on campus!</p>
                    ) : (
                        <div className="profile-event-list">
                            {userClubs.map(club => (
                                <Link to={`/clubs/${club.id}`} key={club.id} className="profile-event-card">
                                    <div className="profile-event-name">{club.name}</div>
                                    {club.admins.map(a => a.id).includes(user.user.id) ? <span className="profile-club-admin">Admin</span> : null}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-qr-card">
                <h2>show the club this to check in!</h2>
                <QRCodeCanvas value={String(user.user.id)} size={180} level="M" />
            </div>
        </div>
    );
}

export default Profile;