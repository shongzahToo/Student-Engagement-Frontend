import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import formatDate from "../../Tools/FormatDate";
import {
    getEvent,
    getEvents,
    rsvpToEvent,
    cancelRsvpToEvent,
    getClubs,
    submitDraft,
    goLive,
    submitFeedback,
    getFeedbacks,
    approveEvent,
    endEvent
} from "../../Tools/MockAPI/FakeAPI";
import { updateField } from "../../Tools/Updators/Updators";
import "./EventPage.css";



function StarRating({ value, onChange, readOnly = false }) {
    const [hovered, setHovered] = useState(null);
    const active = hovered ?? value;

    return (
        <div className="star-rating">
            {Array.from({ length: 10 }, (_, i) => {
                const star = i + 1;
                return (
                    <span
                        key={star}
                        className={"star" + (star <= active ? " filled" : "") + (readOnly ? " readonly" : "")}
                        onClick={!readOnly ? () => onChange(star) : undefined}
                        onMouseEnter={!readOnly ? () => setHovered(star) : undefined}
                        onMouseLeave={!readOnly ? () => setHovered(null) : undefined}
                    >
                        ★
                    </span>
                );
            })}
            {value > 0 && (
                <span className="star-value">
                    {value}
                    <span className="star-denom">/10</span>
                </span>
            )}
        </div>
    );
}

function EventPage({ user, events, clubs }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isOn, setIsOn] = useState(false);
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClubLoading, setIsClubLoading] = useState(false);
    const [isEventsLoading, setIsEventsLoading] = useState(false);
    const [isFeedbacksLoading, setIsFeedbacksLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);

    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

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
    }, [clubs.clubs, clubs.setClubs]);

    useEffect(() => {
        updateField(events.events, events.setEvents, setIsEventsLoading, getEvents);
    }, [events.events, events.setEvents]);

    useEffect(() => {
        const updateFeedbacks = async () => {
            setIsFeedbacksLoading(true);
            const data = await getFeedbacks(id);
            setFeedbacks(data.feedbacks?.filter(f => f.eventId == id) ?? []);
            setIsFeedbacksLoading(false);
        };

        updateFeedbacks();
    }, [id]);

    console.log(event)

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
    const isAdmin = user.user?.type == "admin" || !isClubLoading && eventClub?.admins?.map(a => a.id).includes(user?.user?.id);

    const eventFeedbacks = feedbacks;

    const getFeedbackAuthor = fb => {
        return (
            fb.user ??
            fb.author ??
            event.users.find(u => u.id == fb.userId) ??
            null
        );
    };

    const myFeedback = !isAdmin
        ? eventFeedbacks.find(f => f.userId == user?.user?.id)
        : null;

    const averageRating = eventFeedbacks.length > 0
        ? (eventFeedbacks.reduce((sum, f) => sum + f.rating, 0) / eventFeedbacks.length).toFixed(1)
        : null;

    const handleFeedbackSubmit = async () => {
        if (rating === 0) {
            setSubmitError("Please select a star rating before submitting.");
            return;
        }

        setSubmitError("");
        setIsSubmitting(true);

        try {
            const newFeedback = {
                userId: user.user.id,
                eventId: Number(id),
                rating,
                description,
                user: user.user
            };

            setFeedbacks([...feedbacks, newFeedback]);
            await submitFeedback(newFeedback);
        } catch {
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="event-page">
            <Link to="/events">← See all events</Link>

            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p><strong>Club:</strong> {isClubLoading ? "Loading..." : eventClub?.name}</p>
            <p><strong>Date:</strong> {formatDate(event.dateTime)}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Attendees:</strong> {event.users.length}</p>

            <div className="bottom-content">
                <div>
                    <span className="badge">{event.tag}</span>
                    {isOn ? <div className="badge rsvped">RSVPed</div> : null}
                </div>

                {user.user && event.status == 3 ? (
                    <div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isOn}
                                onChange={async () => {
                                    setIsOn(!isOn);

                                    if (!isOn) {
                                        setEvent({ ...event, users: [...event.users, user.user] });
                                        const updatedEvent = await rsvpToEvent(event.id, user.user.id);
                                        setEvent(updatedEvent);
                                    } else {
                                        setEvent({
                                            ...event,
                                            users: event.users.filter(u => u.id != user.user.id)
                                        });
                                        const updatedEvent = await cancelRsvpToEvent(event.id, user.user.id);
                                        setEvent(updatedEvent);
                                    }

                                    navigate(`/events/${id}`);
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                        <p className="sliderTitle">{isOn ? "RSVPed" : "Not RSVPed"}</p>
                    </div>
                ) : null}
            </div>

            {isAdmin ? (
                <div className="admin-event-panel">
                    <div className="admin-event-panel-header">
                        <h2>Admin Panel</h2>

                        <div className="buttons">
                            {event.status == 0 ? (
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


                            {event.status == 1 ? (
                                user.user?.type === "admin" ? (
                                    <span
                                        className="submit-button"
                                        onClick={async () => {
                                            const updatedEvent = await approveEvent(event.id, user.user.id);
                                            setEvent(updatedEvent);
                                        }}
                                    >
                                        Approve Event
                                    </span>
                                ) : (
                                    <span className="badge">Waiting Approval!</span>
                                )
                            ) : null}

                            {event.status == 2 ? (
                                user?.user.type == "admin" ? (
                                    <span
                                        className="submit-button"
                                        onClick={async () => {
                                            console.log(event.id)
                                            await goLive(event.id);

                                            setEvent(prev => ({
                                                ...prev,
                                                status: 3
                                            }));

                                            events.setEvents(prev =>
                                                prev.map(e =>
                                                    e.id == event.id ? { ...e, status: 3 } : e
                                                )
                                            );

                                            navigate(`/admin`);
                                        }}
                                    >
                                        Go Live!
                                    </span>
                                ) : (
                                    <span className="badge">Awaiting approval</span>
                                )
                            ) : null}

                            {event.status == 3 ? (
                                <span
                                    className="submit-button"
                                    onClick={async () => {
                                        await endEvent(event.id);

                                        setEvent(prev => ({
                                            ...prev,
                                            status: 4
                                        }));

                                        events.setEvents(prev =>
                                            prev.map(e =>
                                                e.id == event.id ? { ...e, status: 4 } : e
                                            )
                                        );
                                    }}
                                >
                                    End Event
                                </span>
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
                            {event.users.map(rsvpUser => (
                                <li
                                    key={rsvpUser.id}
                                    className={"rsvp-row " + (rsvpUser.id == user.user.id ? "current-user" : "")}
                                >
                                    <div className="rsvp-avatar">
                                        {rsvpUser?.username
                                            ?.split(" ")
                                            .slice(0, 2)
                                            .map(word => word[0]?.toUpperCase())
                                            .join("")}
                                    </div>

                                    <div>
                                        <div className="rsvp-name">
                                            {rsvpUser.id == user.user.id ? "You" : rsvpUser.username}
                                        </div>
                                    </div>

                                    <div className="rsvp-points">
                                        <span className="coin">🪙</span>
                                        {rsvpUser.points} pts
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="feedback-section">
                        <div className="feedback-section-header">
                            <h3>Reviews ({eventFeedbacks.length})</h3>

                            {averageRating && (
                                <div className="feedback-average">
                                    <span className="feedback-average-score">{averageRating}</span>
                                    <span className="feedback-average-label">avg / 10</span>
                                </div>
                            )}
                        </div>

                        {isFeedbacksLoading ? (
                            <p className="feedback-loading">Loading reviews...</p>
                        ) : eventFeedbacks.length === 0 ? (
                            <p className="feedback-empty">No reviews submitted yet.</p>
                        ) : (
                            <ul className="feedback-list">
                                {eventFeedbacks.map((fb, index) => {
                                    const author = getFeedbackAuthor(fb);

                                    return (
                                        <li key={fb.id ?? index} className="feedback-row">
                                            <div className="feedback-row-top">
                                                <div className="rsvp-avatar feedback-avatar">
                                                    {author?.username
                                                        ?.split(" ")
                                                        .slice(0, 2)
                                                        .map(w => w[0]?.toUpperCase())
                                                        .join("") ?? "?"}
                                                </div>

                                                <span className="feedback-author">
                                                    {author?.username ?? `User ${fb.userId}`}
                                                </span>

                                                <StarRating value={fb.rating} readOnly />
                                            </div>

                                            {fb.description ? (
                                                <p className="feedback-review-text">{fb.description}</p>
                                            ) : (
                                                <p className="feedback-review-text feedback-empty">
                                                    No written review.
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            ) : (
                event.status == 4 ? (
                    isFeedbacksLoading ? (
                        <div className="feedback-section">
                            <p className="feedback-loading">Loading feedback...</p>
                        </div>
                    ) : (
                        <div className="feedback-section">
                            <h2 className="feedback-title">Event Feedback</h2>

                            {myFeedback ? (
                                <div className="feedback-submitted">
                                    <div className="feedback-submitted-badge">
                                        ✓ Feedback submitted
                                    </div>

                                    <p className="feedback-submitted-hint">
                                        You've already reviewed this event — feedback can't be changed after submission.
                                    </p>

                                    <StarRating value={myFeedback.rating} readOnly />

                                    {myFeedback.description && (
                                        <p className="feedback-review-text feedback-review-mine">
                                            "{myFeedback.description}"
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="feedback-form">
                                    <p className="feedback-prompt">
                                        How would you rate this event?
                                    </p>

                                    <StarRating value={rating} onChange={setRating} />

                                    <textarea
                                        className="feedback-textarea"
                                        placeholder="Leave a review (optional)..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                    />

                                    <div className="feedback-form-footer">
                                        {submitError && (
                                            <span className="feedback-error">{submitError}</span>
                                        )}

                                        <button
                                            className="feedback-submit-btn"
                                            onClick={handleFeedbackSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ) : null
            )}
        </div>
    );
}

export default EventPage;