import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getEvents } from "../../Tools/MockAPI/FakeAPI.jsx";
import { updateField } from "../../Tools/Updators/Updators.jsx";
import EventCard from "../../Components/HomeComponents/EventCard.jsx";
import FeaturedEventCard from "../../Components/HomeComponents/FeaturedEventCard.jsx";
import "./Home.css";

function formatEvents(events, currentUser) {
    return events.filter(event => event.status == 3).map(event => ({
        ...event,
        attendees: event.users.length,
        rsvped: currentUser ? event.users.includes(currentUser.id) : false
    }));
}

function Home({ user, events }) {
    const [eventsLoading, setEventsLoading] = useState(false);

    const currentUser = user?.user;

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    const formattedEvents = useMemo(() => {
        return formatEvents(events.events ?? [], currentUser);
    }, [events.events, currentUser]);

    const featuredEvents = useMemo(() => {
        return [...formattedEvents]
            .sort((a, b) => b.attendees - a.attendees)
            .slice(0, 3);
    }, [formattedEvents]);

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
                    featuredEvents.slice(0, 2).map(event => (
                        <FeaturedEventCard key={event.id} event={event} />
                    ))
                )}
            </section>

            <section className="events-section">
                {eventsLoading ? (
                    <div>Loading events...</div>
                ) : (
                    <div className="events-grid">
                        {featuredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}

                        {formattedEvents.length > 3 && (
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