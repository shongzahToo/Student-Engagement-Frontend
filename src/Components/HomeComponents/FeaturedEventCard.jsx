import { Link } from "react-router-dom";

function FeaturedEventCard({ event }) {
    return (
        <Link to={`/events/${event.id}`} className="featured-event-card-link">
            <div className="featured-event-card">
                <div className="featured-event-card-header">
                    <div className="featured-event-card-title">{event.name}</div>
                    <div className="featured-event-card-badge">{event.tag}</div>
                    {event.rsvped && <div className="event-card-badge rsvped">RSVPed</div>}
                </div>

                <div className="featured-event-card-body">
                    <div className="featured-event-card-meta">
                        {event.club} - {event.location} - {event.attendees} going
                    </div>

                    <div className="featured-event-card-date-label">Date & Time</div>
                    <div className="featured-event-card-date">
                        {event.date} - {event.time}
                    </div>

                    <div className="featured-event-card-divider" />

                    <div className="featured-event-card-footer">
                        <span>{event.location}</span>
                        <span className="featured-event-card-countdown">Campus event</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default FeaturedEventCard;