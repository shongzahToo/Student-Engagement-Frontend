import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { updateField } from "../../Tools/Updator.jsx";
import { getEvents } from "../../Tools/controller.jsx";
import formatDate from "../../Tools/FormatDate";
import "./Events.css";

function Events({ user, events }) {
    const [eventsLoading, setEventsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [sortBy, setSortBy] = useState("attendees-desc");
    const [showRsvpedOnly, setShowRsvpedOnly] = useState(false);

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    const tags = useMemo(() => {
        return ["All", ...new Set(events?.events?.map(event => event.tag))];
    }, [events.events]);

    const filteredEvents = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();
        return events?.events?.filter(event => {
                if(event.status != 3) { return;}
                const matchesSearch =
                    event.name.toLowerCase().includes(normalizedSearch) ||
                    event.description.toLowerCase().includes(normalizedSearch) ||
                    event.club.toLowerCase().includes(normalizedSearch) ||
                    event.location.toLowerCase().includes(normalizedSearch) ||
                    event.tag.toLowerCase().includes(normalizedSearch);

                const matchesTag = selectedTag === "All" || event.tag === selectedTag;
                const matchesRsvp = !showRsvpedOnly || event.users.map(u => u.id == user?.user?.id);

                return matchesSearch && matchesTag && matchesRsvp;
            })
            .sort((a, b) => {
                if (sortBy === "attendees-desc") return b.attendees - a.attendees;
                if (sortBy === "attendees-asc") return a.attendees - b.attendees;
                if (sortBy === "date-asc") return a.dateTime - b.dateTime;
                if (sortBy === "date-desc") return b.dateTime - a.dateTime;
                if (sortBy === "name-asc") return a.name.localeCompare(b.name);
                if (sortBy === "club-asc") return a.club.localeCompare(b.club);
                return 0;
            });
    }, [events.events, search, selectedTag, sortBy, showRsvpedOnly]);

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
            ) : filteredEvents?.length === 0 ? (
                <div className="events-empty">No events match your filters.</div>
            ) : (
                <>
                    <div className="events-results-count">
                        Showing {filteredEvents?.length} event{filteredEvents?.length === 1 ? "" : "s"}
                    </div>

                    <div className="events-grid">
                        {filteredEvents?.map(event => (
                            <Link key={event.id} to={`/events/${event.id}`} className="event-card-link">
                                <div className="event-card">
                                    <div className="event-card-header">
                                        <div className="event-card-title">{event.name}</div>
                                        <div className={"event-card-badge " + event.tag.toLowerCase()}>
                                            {event.tag}
                                        </div>
                                        {event?.users?.map(u => u.id).includes(user?.user?.id) ? <div className="event-card-badge rsvped">RSVPed</div>: null}
                                    </div>

                                    <div className="event-card-body">
                                        <div className="event-card-meta">
                                            {event.club} - {event.location} - {event.attendees} going
                                        </div>

                                        <div className="event-card-date-label">Date & Time</div>
                                        <div className="event-card-date">
                                            {event?.dateTime !== null ? formatDate(event?.dateTime) : ""}
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