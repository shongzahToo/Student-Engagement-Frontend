import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { updateField } from "../../Tools/Updators/Updators";
import { getEvents } from "../../Tools/MockAPI/FakeAPI";
import "./Events.css";

function formatEvents(events, user) {
    return events.filter(e => e.stage == 3).map(event => ({
        ...event,
        attendees: event.users.length,
        rsvped: user.user ? event.users.includes(user.user.id) : false
    }));
}

function parseEventDate(event) {
    return new Date(`${event.date}, 2026 ${event.time}`);
}

function Events({ user, events }) {
    const [eventsLoading, setEventsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [sortBy, setSortBy] = useState("attendees-desc");
    const [showRsvpedOnly, setShowRsvpedOnly] = useState(false);

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    const formattedEvents = useMemo(
        () => formatEvents(events?.events ?? [], user),
        [events.events, user]
    );

    const tags = useMemo(() => {
        return ["All", ...new Set(formattedEvents.map(event => event.tag))];
    }, [formattedEvents]);

    const filteredEvents = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        return formattedEvents
            .filter(event => {
                const matchesSearch =
                    event.name.toLowerCase().includes(normalizedSearch) ||
                    event.description.toLowerCase().includes(normalizedSearch) ||
                    event.club.toLowerCase().includes(normalizedSearch) ||
                    event.location.toLowerCase().includes(normalizedSearch) ||
                    event.tag.toLowerCase().includes(normalizedSearch);

                const matchesTag = selectedTag === "All" || event.tag === selectedTag;
                const matchesRsvp = !showRsvpedOnly || event.rsvped;

                return matchesSearch && matchesTag && matchesRsvp;
            })
            .sort((a, b) => {
                if (sortBy === "attendees-desc") return b.attendees - a.attendees;
                if (sortBy === "attendees-asc") return a.attendees - b.attendees;
                if (sortBy === "date-asc") return parseEventDate(a) - parseEventDate(b);
                if (sortBy === "date-desc") return parseEventDate(b) - parseEventDate(a);
                if (sortBy === "name-asc") return a.name.localeCompare(b.name);
                if (sortBy === "club-asc") return a.club.localeCompare(b.club);
                return 0;
            });
    }, [formattedEvents, search, selectedTag, sortBy, showRsvpedOnly]);

    return (
        <section className="events-page">
            <div className="events-page-header">
                <div>
                    <div className="events-page-eyebrow">Explore Events</div>
                    <h1 className="events-page-title">Find your next campus event.</h1>
                    <p className="events-page-subtitle">
                        Search by name, club, location, or tag. Sort by popularity, date, and more.
                    </p>
                </div>
            </div>

            <div className="events-toolbar">
                <input
                    className="events-search"
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />

                <select
                    className="events-select"
                    value={selectedTag}
                    onChange={event => setSelectedTag(event.target.value)}
                >
                    {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>

                <select
                    className="events-select"
                    value={sortBy}
                    onChange={event => setSortBy(event.target.value)}
                >
                    <option value="attendees-desc">Most Popular</option>
                    <option value="attendees-asc">Least Popular</option>
                    <option value="date-asc">Soonest First</option>
                    <option value="date-desc">Latest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="club-asc">Club A-Z</option>
                </select>

                <label className="events-checkbox">
                    <input
                        type="checkbox"
                        checked={showRsvpedOnly}
                        onChange={event => setShowRsvpedOnly(event.target.checked)}
                    />
                    RSVP'd only
                </label>
            </div>

            {eventsLoading ? (
                <div className="events-empty">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
                <div className="events-empty">No events match your filters.</div>
            ) : (
                <>
                    <div className="events-results-count">
                        Showing {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"}
                    </div>

                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <Link key={event.id} to={`/events/${event.id}`} className="event-card-link">
                                <div className="event-card">
                                    <div className="event-card-header">
                                        <div className="event-card-title">{event.name}</div>
                                        <div className={"event-card-badge " + event.tag.toLowerCase()}>
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
                                            {event.date} - {event.time}
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
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default Events;