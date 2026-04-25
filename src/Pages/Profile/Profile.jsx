import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { updateField } from "../../Tools/Updator.jsx";
import formatDate from "../../Tools/FormatDate.jsx";
import { getClubs, getEvents, getFeedbacks } from "../../Tools/controller.jsx";

import "./Profile.css";
function Profile({ user = null, events, clubs }) {
    const navigate = useNavigate();
    const [eventsLoading, setEventsLoading] = useState(events.events === null);
    const [clubsLoading, setClubsLoading] = useState(clubs.clubs === null);

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    useEffect(() => {
        updateField(clubs.clubs, clubs.setClubs, setClubsLoading, getClubs);
    }, [clubs, clubs.clubs]);

    if (!user?.user) {
        return <Navigate to="/login" />;
    }

    const userEvents = events?.events?.filter(event => event.users.map(u => u.id).includes(user.user.id));
    const userClubs = clubs?.clubs?.filter(club => club.users.map(u => u.id).includes(user.user.id));
    return (
        <div className="profile-layout">
            <div className="profile-main">
                <div className="profile-top">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {user?.user?.name?.split(" ").slice(0, 2).map(word => word[0].toUpperCase()).join("")}
                        </div>

                        <div className="profile-details">
                            <div className="profile-username">{user.user.name}</div>
                            <div className="profile-points">
                                <span className="coin">🪙</span>
                                {user.user.points} pts
                            </div>
                        </div>

                        <button
                            className="logout"
                            onClick={() => {
                                user.setUser(null);
                                navigate("/");
                            }}
                        >
                            logout
                        </button>
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
                                        {formatDate(event.dateTime)}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-events">
                    {eventsLoading ? (
                        <div className="profile-page">Loading Events...</div>
                    ) : userEvents.filter(e => e.status == 4).length === 0 ? (
                        <>
                            <h2>Previous Events</h2>
                            <p>You have no past events!</p>
                        </>
                    ) : (
                        <div className="profile-event-list">
                            <h2>Previous Events</h2>
                            {userEvents.filter(e => e.status == 4).map(event => (
                                <Link to={`/events/${event.id}`} key={event.id} className="profile-event-card">
                                    <div className="profile-event-name">{event.name}</div>
                                    <div className="profile-event-meta">
                                        {formatDate(event.dateTime)}
                                    </div>

                                    {!user.admin ? <FeedbackStatus eventId={event.id} userId={user.user.id} /> : null}
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
                                    {club?.users?.filter(u => u.admin).some(u => u.id == user.user.id) ? <span className="profile-club-admin">Admin</span> : null}
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

function FeedbackStatus({ eventId, userId }) {

    const [feedbacks, setFeedbacks] = useState(null);

    useEffect(() => {
        let active = true;

        async function loadFeedbacks() {
            const data = await getFeedbacks(Number(eventId));
            if (active) {
                setFeedbacks(data);
            }
        }

        loadFeedbacks();

        return () => {
            active = false;
        };
    }, [eventId]);

    if (feedbacks === null) {
        return <div className="profile-feedback-flag">Loading feedback...</div>;
    }

    const hasGivenFeedback = feedbacks.some(
        feedback => feedback.userId == userId
    );

    return hasGivenFeedback ? (
        <div className="profile-feedback-flag">Feedback given</div>
    ) : (
        <div className="profile-feedback-flag profile-feedback-needed">
            Feedback needed
        </div>
    );
}

export default Profile;