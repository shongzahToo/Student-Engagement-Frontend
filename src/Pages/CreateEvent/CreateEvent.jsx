import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createEvent, getClubById } from "../../Tools/MockAPI/FakeAPI.jsx";
import "./CreateEvent.css";

function CreateEvent({ user, events }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({ name: "", description: "", date: "", time: "", location: "", tag: "social" });

    useEffect(() => {
        async function loadClub() {
            try {
                const foundClub = await getClubById(id);
                setClub(foundClub);
            } catch {
                setError("Could not load this club.");
            } finally {
                setLoading(false);
            }
        }

        loadClub();
    }, [id]);

    const isAdmin = club?.admins?.map(a => a.id).includes(user?.user?.id);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.date || !formData.time || !formData.location) {
            setError("Please fill out all required fields.");
            return;
        }

        if (!club || !isAdmin) {
            setError("You do not have permission to create events for this club.");
            return;
        }

        setSaving(true);

        const newDate = new Date(`${formData.date}T${formData.time}:00`);
        try {
            const newEvent = await createEvent({
                name: formData.name,
                dateTime: newDate,
                location: formData.location,
                club: club.name,
                clubId: club.id,
                users: []
            });

            if (events?.setEvents) {
                events.setEvents(prev => [...(prev ?? []), newEvent]);
            }

            navigate(`/events/${newEvent.id}`);
        } catch {
            setError("Something went wrong while creating the event.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="create-event-page">Loading club...</div>;
    }

    if (!club) {
        return (
            <div className="create-event-page create-event-message">
                <h1>Club not found</h1>
                <Link to="/clubs">← Back to all clubs</Link>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="create-event-page create-event-message">
                <h1>Access denied</h1>
                <p>Only club admins can create events for {club.name}.</p>
                <Link to={`/clubs/${club.id}`}>← Back to {club.name}</Link>
            </div>
        );
    }

    return (
        <div className="create-event-page">
            <Link to={`/clubs/${club.id}`} className="create-event-back-link">
                ← Back to {club.name}
            </Link>

            <div className="create-event-header">
                <div>
                    <div className="create-event-eyebrow">Host New Event</div>
                    <h1>Create an event</h1>
                    <p>
                        Add the details for a new event hosted by <strong>{club.name}</strong>.
                    </p>
                </div>
            </div>

            {error && <div className="create-event-error">{error}</div>}

            <form className="create-event-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Event Name *</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ozarks Game Night"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell students what to expect..."
                        rows="5"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Time *</label>
                        <input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="location">Location *</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Student Union"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tag">Category</label>
                        <select
                            id="tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleChange}
                        >
                            <option value="social">Social</option>
                            <option value="tech">Tech</option>
                            <option value="career">Career</option>
                            <option value="sports">Sports</option>
                            <option value="creative">Creative</option>
                            <option value="health">Health</option>
                            <option value="food">Food</option>
                            <option value="impact">Impact</option>
                            <option value="fun">Fun</option>
                            <option value="chill">Chill</option>
                        </select>
                    </div>
                </div>

                <div className="create-event-actions">
                    <Link to={`/clubs/${club.id}`} className="cancel-event-button">
                        Cancel
                    </Link>

                    <button type="submit" className="submit-event-button" disabled={saving}>
                        {saving ? "Creating..." : "Create Event"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateEvent;