import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

// pages
import Navbar from "./Components/Navbar/Navbar.jsx";
import Home from "./Pages/Home/Home.jsx";
import Events from "./Pages/Events/Events.jsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.jsx";
import Login from "./Pages/Login/Login.jsx";
import EventPage from "./Pages/EventPage/EventPage.jsx";
import Profile from "./Pages/Profile/Profile.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState(null);
  const [users, setUsers] = useState(null);
  const userPassObject = { user: user, setUser: setUser }
  const eventsPassObject = { events: events, setEvents: setEvents }
  const usersPassObject = { users: users, setUsers: setUsers }

  return (
    <>
      <Navbar user={user} />
      <Routes> 
        <Route path="/" element={ <Home user={userPassObject} events={eventsPassObject} /> } />
        <Route path="/events" element={ <Events user={userPassObject} events={eventsPassObject} /> } />
        <Route path="/events/:id" element={ <EventPage user={userPassObject} events={eventsPassObject} /> } />
        <Route path="/profile" element={ <Profile user={userPassObject} events={eventsPassObject}/> } />
        <Route path="/login" element={ <Login users={usersPassObject} setUser={setUser}/> } />
        <Route path="/leaderboard" element={<Leaderboard user={user} users={usersPassObject} />} />
      </Routes>
    </>
  );
} 

export default App;