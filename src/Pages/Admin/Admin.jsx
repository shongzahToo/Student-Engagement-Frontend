import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents, getUsers, getClubs } from "../../Tools/controller.jsx";
import formatDate from "../../Tools/FormatDate.jsx";
import "./Admin.css";
import { updateField } from "../../Tools/Updator.jsx";

import { approveEvent, getUserById } from "../../Tools/controller.jsx";

function getResourceStatusLabel(status) {
    if (status === 0) return "Not needed";
    if (status === 1) return "Awaiting";
    if (status === 2) return "Approved";

    return "Unknown";
}

function getResourceStatusClass(status) {
    if (status === 0) return "muted";
    if (status === 1) return "pending";
    if (status === 2) return "approved";

    return "warning";
}

function Admin({ events, clubs, users, user }) {
    const [activeTab, setActiveTab] = useState("events");
    const [eventsLoading, setEventsLoading] = useState(false)
    const [clubsLoading, setClubsLoading] = useState(false)
    const [usersLoading, setUsersLoading] = useState(false)
    const [eventSearch, setEventSearch] = useState("");
    const [clubSearch, setClubSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");

    const [eventFilter, setEventFilter] = useState("all");

    const navigation = useNavigate();

    useEffect(() => {
        updateField(events.events, events.setEvents, setEventsLoading, getEvents);
    }, [events, events.events]);

    useEffect(() => {
        updateField(clubs.clubs, clubs.setClubs, setClubsLoading, getClubs);
    }, [clubs, clubs.clubs]);

    useEffect(() => {
        updateField(users.users, users.setUsers, setUsersLoading, getUsers);
    }, [users, users.users]);

    if(user.user) {
        async () =>  {
            const tempUser = await getUserById(user.user.id)
            if(!tempUser || !tempUser.admin) {
                navigation('/login')
            }
        }
    } else {
        navigation('/login')
    }

    async function handleApproveEvent(eventId) {
        const updatedEvent = await approveEvent(Number(user.user.id), eventId);

        events.seteEVents(prev =>
            prev.map(event =>
                event.id === eventId ? updatedEvent : event
            )
        );
    }

    const filteredEvents = useMemo(() => {
        return events.events?.filter(event => {
            const searchValue = eventSearch.toLowerCase();

            const matchesSearch =
                event.name?.toLowerCase().includes(searchValue) ||
                event.club?.toLowerCase().includes(searchValue) ||
                event.location?.toLowerCase().includes(searchValue) ||
                event.tag?.toLowerCase().includes(searchValue);

            const matchesFilter =
                eventFilter === "all" ||
                (eventFilter === "pending" && event.status === 1) ||
                (eventFilter === "facilities" && event.facilities === 1) ||
                (eventFilter === "it" && event.it === 1) ||
                (eventFilter === "finance" && event.finance === 1);

            return matchesSearch && matchesFilter;
        });
    }, [events, eventSearch, eventFilter]);

    const filteredClubs = useMemo(() => {
        return clubs.clubs?.filter(club => {
            const searchValue = clubSearch.toLowerCase();

            return (
                club.name?.toLowerCase().includes(searchValue) ||
                String(club.users?.length ?? "").includes(searchValue) ||
                String(club.events?.length ?? "").includes(searchValue)
            );
        });
    }, [clubs, clubSearch]);

    const filteredUsers = useMemo(() => {
        return users.users?.filter(user => {
            const searchValue = userSearch.toLowerCase();

            return (
                user.name?.toLowerCase().includes(searchValue) ||
                user.type?.toLowerCase().includes(searchValue) ||
                String(user.points ?? "").includes(searchValue)
            );
        });
    }, [users, userSearch]);

    return (
        <main className="admin-page">
            <header className="admin-page-header">
                <div>
                    <div className="admin-page-eyebrow">Admin Console</div>
                    <h1 className="admin-page-title">Manage campus activity.</h1>
                    <p className="admin-page-subtitle">
                        Review events, clubs, and users from one dashboard.
                    </p>
                </div>
            </header>

            <div className="admin-tabs">
                <button
                    className={activeTab === "events" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("events")}
                >
                    Events
                </button>

                <button
                    className={activeTab === "clubs" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("clubs")}
                >
                    Clubs
                </button>

                <button
                    className={activeTab === "users" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
            </div>


            <>
                {activeTab === "events" && (
                    <section className="admin-panel">
                        <div className="admin-toolbar events-admin-toolbar">
                            <input
                                className="admin-search"
                                type="text"
                                placeholder="Search events by name, club, location, or tag..."
                                value={eventSearch}
                                onChange={e => setEventSearch(e.target.value)}
                            />

                            <select
                                className="admin-select"
                                value={eventFilter}
                                onChange={e => setEventFilter(e.target.value)}
                            >
                                <option value="all">All events</option>
                                <option value="pending">Pending event approval</option>
                                <option value="facilities">Facilities awaiting approval</option>
                                <option value="it">IT awaiting approval</option>
                                <option value="finance">Finance awaiting approval</option>
                            </select>
                        </div>

                        <div className="admin-results-count">
                            Showing {filteredEvents?.length} event{filteredEvents?.length === 1 ? "" : "s"}
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Club</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Facilities</th>
                                        <th>IT</th>
                                        <th>Finance</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredEvents?.map(event => (
                                        <tr key={event.id} onClick={() => navigation(`/events/${event.id}`)} className="clickable">
                                            <td>
                                                <div className="admin-table-title">{event.name}</div>
                                                <div className="admin-table-subtitle">{event.tag}</div>
                                            </td>

                                            <td>{event.club}</td>
                                            <td>{formatDate(event.dateTime)}</td>
                                            <td>{event.location}</td>

                                            <td>
                                                <span className={`admin-pill ${getResourceStatusClass(event.facilities)}`}>
                                                    {getResourceStatusLabel(event.facilities)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`admin-pill ${getResourceStatusClass(event.it)}`}>
                                                    {getResourceStatusLabel(event.it)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`admin-pill ${getResourceStatusClass(event.finance)}`}>
                                                    {getResourceStatusLabel(event.finance)}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={event.finance ? "admin-pill warning" : "admin-pill muted"}>
                                                    {event.finance ? "Needed" : "Clear"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`admin-pill ${getStatusClass(event.status)}`}>
                                                    {getStatusLabel(event.status)}
                                                </span>
                                            </td>

                                            <td>
                                                {event.status === 1 ? (
                                                    <div className="admin-table-actions">
                                                        <button
                                                            className="admin-action approve"
                                                            onClick={() => handleApproveEvent(event.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="admin-muted-text">No action</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredEvents?.length === 0 && (
                            <div className="admin-empty">No events match your search.</div>
                        )}
                    </section>
                )}

                {activeTab === "clubs" && (
                    <section className="admin-panel">
                        <div className="admin-toolbar">
                            <input
                                className="admin-search"
                                type="text"
                                placeholder="Search clubs..."
                                value={clubSearch}
                                onChange={e => setClubSearch(e.target.value)}
                            />
                        </div>

                        <div className="admin-results-count">
                            Showing {filteredClubs?.length} club{filteredClubs?.length === 1 ? "" : "s"}
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Club</th>
                                        <th>Members</th>
                                        <th>Admins</th>
                                        <th>Events</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredClubs.map(club => (
                                        <tr key={club.id} onClick={() => navigation(`/clubs/${club.id}`)} className="clickable">
                                            <td>
                                                <div className="admin-table-title">{club.name}</div>
                                            </td>
                                            <td>{club.users?.length ?? 0}</td>
                                            <td>{club.users.filter(u => u.admin)?.length ?? 0}</td>
                                            <td>{club.events?.length ?? 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredClubs.length === 0 && (
                            <div className="admin-empty">No clubs match your search.</div>
                        )}
                    </section>
                )}

                {activeTab === "users" && (
                    <section className="admin-panel">
                        <div className="admin-toolbar">
                            <input
                                className="admin-search"
                                type="text"
                                placeholder="Search users by name, role, or points..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                            />
                        </div>

                        <div className="admin-results-count">
                            Showing {filteredUsers.length} user{filteredUsers.length === 1 ? "" : "s"}
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="admin-table-title">{user.name}</div>
                                            </td>

                                            <td>
                                                <span className={user.type === "admin" ? "admin-pill approved" : "admin-pill muted"}>
                                                    {user.type ?? "user"}
                                                </span>
                                            </td>

                                            <td>{user.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="admin-empty">No users match your search.</div>
                        )}
                    </section>
                )}
            </>
        </main>
    );
}

function getStatusLabel(status) {
    if (status === -1) return "Denied";
    if (status === 0) return "Pending";
    if (status === 1) return "Draft";
    if (status === 2) return "Submitted";
    if (status === 3) return "Live";
    if (status === 4) return "Archived";

    return "Unknown";
}

function getStatusClass(status) {
    if (status === -1) return "denied";
    if (status === 0) return "pending";
    if (status === 3) return "approved";
    if (status === 4) return "muted";

    return "warning";
}

export default Admin;