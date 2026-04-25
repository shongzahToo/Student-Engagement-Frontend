import { Link } from "react-router-dom";
import formatDate from "../../Tools/FormatDate";

function EventCard({ event }) {
    return (
        <Link to={`/events/${event.id}`} className="event-card-link">
            <div className="event-card">
                <div className="event-card-header">
                    <div className="event-card-title">{event.name}</div>

                    <div className={`event-card-badge ${event.tag.toLowerCase()}`}>
                        {event.tag}
                    </div>

                    {event.rsvped && <div className="event-card-badge rsvped">RSVPed</div>}
                </div>

                <div className="event-card-body">
                    <div className="event-card-meta">
                        {event.club} - {event.location} - {event.attendees} going
                    </div>

                    <div className="event-card-date-label">Date & Time</div>
                    <div className="event-card-date">
                        {formatDate(event.dateTime)}
                    </div>

                    <div className="event-card-divider" />

                    <div className="event-card-footer">
                        <span>{event.location}</span>
                        <span className="event-card-attendees">
                            <strong>{event.attendees}</strong> going
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default EventCard;