import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { fakeApiEvents } from "../../Tools/MockAPI/FakeAPIData";
import "./EventPage.css";
import { rsvpToEvent, cancelRsvpToEvent } from "../../Tools/MockAPI/FakeAPI";

function EventPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOn, setIsOn] = useState(false);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const foundEvent = fakeApiEvents.find(e => e.id == id);
        setEvent(foundEvent);
    }, [id]);

    useEffect(() => {
        if (event && user?.user?.id) {
            setIsOn(event.users.includes(user.user.id));
        }
    }, [event, user]);

    if (!event) {
        return (
            <div>
                <div className="event-page-not-found"></div>
                <Link to="/events">Back to all events</Link>
            </div>
        );
    }

    return (
        <div className="event-page">
            <Link to="/events">← See all events</Link>
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p><strong>Club:</strong> {event.club}</p>
            <p><strong>Date:</strong> {event.date} at {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Attendees:</strong> {event.users.length}</p>
            <div className="bottom-content">
                <div>
                    <span className="badge">{event.tag}</span>
                    {isOn ? <div className="badge rsvped">RSVPed</div> : null}
                </div>
                {user.user ?
                    <div className="toggle-container">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isOn}
                                onChange={async () => {
                                    const nextState = !isOn;
                                    setIsOn(nextState);

                                    if (nextState) {
                                        setEvent(prev => ({ ...prev, attendees: prev.attendees + 1, users: [...prev.users, user.user.id] }));
                                        await rsvpToEvent(event.id, user.user.id);
                                    } else {
                                        setEvent(prev => ({ ...prev, attendees: prev.attendees - 1, users: prev.users.filter(id => id !== user.user.id) }));
                                        await cancelRsvpToEvent(event.id, user.user.id);
                                    }

                                    navigate(`/events/${id}`);
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                        <p className="sliderTitle">{isOn ? "RSVPed" : "Not RSVPed"}</p>
                    </div> : null}
            </div>
        </div>
    );
}

export default EventPage;