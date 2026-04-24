import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { updateField } from "../../Tools/Updators/Updators.jsx";
import { getEvents } from "../../Tools/MockAPI/FakeAPI";
import "./Profile.css";

function Profile({ user = null, events }) {
    const [eventsLoading, setEventsLoading] = useState(events.events === null);
    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    if (user.user === null) {
        return <Navigate to="/login" />;
    }

    const userEvents = events?.events?.filter(event => event.users.includes(user.user.id));

    return (
        <div className="profile-page">
            <h1>My Profile</h1>

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

            <div className="profile-events">
                <h2>My Events</h2>
                {eventsLoading ? (
                    <div className="profile-page">Loading profile...</div>
                ) : userEvents.length === 0 ? (
                    <>
                        <p>You have not RSVP'd to any events yet. Click <Link to="/events">here</Link> to browse events and get involved on campus!</p>
                    </>
                ) : (
                    <div className="profile-event-list">
                        {userEvents.map(event => (
                            <Link to={`/events/${event.id}`} key={event.id} className="profile-event-card" >
                                <div className="profile-event-name">{event.name}</div>
                                <div className="profile-event-meta">
                                    {event.date} at {event.time}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;