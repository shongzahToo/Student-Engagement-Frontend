import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvent, getEvents, rsvpToEvent, cancelRsvpToEvent, getClubs, submitDraft, goLive } from "../../Tools/MockAPI/FakeAPI";
import { updateField } from "../../Tools/Updators/Updators";
import "./EventPage.css";

function EventPage({ user, events, clubs }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOn, setIsOn] = useState(false);
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClubLoading, setIsClubLoading] = useState(false);
    const [isEventsLoading, setIsEventsLoading] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            const foundEvent = await getEvent(id);
            setEvent(foundEvent);
            setIsLoading(false);
        };

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (event && user?.user?.id) {
            setIsOn(event.users.map(u => u.id).includes(user.user.id));
        }
    }, [event, user]);

    useEffect(() => {
        updateField(clubs.clubs, clubs.setClubs, setIsClubLoading, getClubs);
    }, [clubs, clubs.clubs]);

    useEffect(() => {
        updateField(events.events, events.setEvents, setIsEventsLoading, getEvents);
    }, [events, events.events]);


    if (isLoading) {
        return (
            <div className="event-page-not-found">
                <div>Loading...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="event-page-not-found">
                <h2>Event not found</h2>
                <Link to="/events">Back to all events</Link>
            </div>
        );
    }


    const eventClub = isClubLoading ? null : clubs.clubs?.find(c => c.id == event.clubId);
    const isAdmin = !isClubLoading && eventClub?.admins?.map(a => a.id).includes(user?.user?.id);


    return (
        <div className="event-page">
            <Link to="/events">← See all events</Link>

            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p><strong>Club:</strong> {isClubLoading ? "Loading..." : eventClub?.name}</p>
            <p><strong>Date:</strong> {event.date} at {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Attendees:</strong> {event.users.length}</p>

            <div className="bottom-content">
                <div>
                    <span className="badge">{event.tag}</span>
                    {isOn ? <div className="badge rsvped">RSVPed</div> : null}
                </div>

                {user.user ? (
                    <div className="toggle-container">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isOn}
                                onChange={async () => {
                                    setIsOn(!isOn);

                                    if (!isOn) {
                                        setEvent({...event, users: [...event.users, user.user]})
                                        const updatedEvent = await rsvpToEvent(event.id, user.user.id);
                                        setEvent(updatedEvent);
                                    } else {
                                        setEvent({...event, users: event.users.filter(u=> u.id != user.user.id)})
                                        const updatedEvent = await cancelRsvpToEvent(event.id, user.user.id);
                                        setEvent(updatedEvent);
                                    }

                                    navigate(`/events/${id}`);
                                }}
                            />
                            <span className="slider round"></span>
                        </label>

                        <p className="sliderTitle">
                            {isOn ? "RSVPed" : "Not RSVPed"}
                        </p>
                    </div>
                ) : null}
            </div>

            {isAdmin && (
                <div className="admin-event-panel">
                    <div className="admin-event-panel-header">
                        <h2>Admin Panel</h2>
                        <div className="buttons">
                            {event.stage == 0 ? (
                                <span
                                    className="submit-button"
                                    onClick={async () => {
                                        const updatedEvent = await submitDraft(id);
                                        setEvent(updatedEvent);
                                    }}
                                >
                                    Submit Draft!
                                </span>
                            ) : null}

                            {event.stage == 1 ? (
                                <span className="badge">Waiting Approval!</span>
                            ) : null}

                            {event.stage == 2 ? (
                                <span
                                    className="submit-button"
                                    onClick={async () => {
                                        const updatedEvent = await goLive(id);
                                        setEvent(updatedEvent);
                                    }}
                                >Go Live!</span>
                            ) : null}

                            {event.stage == 3 ? (
                                <span className="status-badge">Live!</span>
                            ) : null}

                            <Link to={`/events/${id}/scan`} className="scan-link-button">
                                Scan People In
                            </Link>
                        </div>
                    </div>

                    <h3>RSVPed Users ({event.users.length})</h3>

                    {event.users.length == 0 ? (
                        <p>No users have RSVPed yet.</p>
                    ) : (
                        <ul className="rsvp-list">
                            {console.log(event)}
                            {event.users.map(rsvpUser => (
                                <li key={rsvpUser.id} className={"rsvp-row " + (rsvpUser.id == user.user.id ? "current-user" : "")}>
                                    <div className="rsvp-avatar">
                                        {rsvpUser?.username.split(" ").slice(0, 2).map(word => word[0]?.toUpperCase()).join("")}
                                    </div>
                                    <div>
                                        <div className="rsvp-name">{(rsvpUser.id == user.user.id ? "you" : rsvpUser.username)}</div>
                                    </div>
                                    <div className="rsvp-points">
                                        <span className="coin">🪙</span>
                                        {rsvpUser.points} pts
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default EventPage;
