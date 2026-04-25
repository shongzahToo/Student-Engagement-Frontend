import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvents } from "../../Tools/controller.jsx";
import { updateField } from "../../Tools/Updator.jsx";
import EventCard from "../../Components/HomeComponents/EventCard.jsx";
import FeaturedEventCard from "../../Components/HomeComponents/FeaturedEventCard.jsx";
import "./Home.css";

function Home({ events }) {
    const [eventsLoading, setEventsLoading] = useState(false);

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-eyebrow">Campus Events Hub</div>

                    <h1 className="hero-title">
                        What's happening
                        <br />
                        <em>on campus.</em>
                    </h1>

                    <p className="hero-subtitle">
                        Discover clubs, socials, career fairs, and everything in between.
                        RSVP in seconds and never miss what matters at your college.
                    </p>
                </div>
                {eventsLoading ? (
                    <div>Loading featured events...</div>
                ) : (
                    events?.events !== null ? events?.events?.slice(0, 2)?.map(event => (
                        <FeaturedEventCard key={event.id} event={event} />
                    ))
                : null)}
            </section>

            <section className="events-section">
                {eventsLoading ? (
                    <div>Loading events...</div>
                ) : (
                    <div className="events-grid">
                        {events.events ? events?.events.map(event => (
                            <EventCard key={event.id} event={event} />
                        )) : null}

                        {events.length > 3 && (
                            <div className="see-all-link">
                                <Link to="/events">Click here to see more →</Link>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </>
    );
}

export default Home;