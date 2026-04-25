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
import Clubs from "./Pages/Clubs/Clubs.jsx";
import ClubPage from "./Pages/ClubPage/ClubPage.jsx";
import CreateEvent from "./Pages/CreateEvent/CreateEvent.jsx";
import ScanUsers from "./Pages/ScanUsers/ScanUsers.jsx";

function App() {
  const [user, setUser] = useState({ id: 1, username: "Avery Johnson", points: 1280 });
  const [events, setEvents] = useState(null);
  const [users, setUsers] = useState(null);
  const [clubs, setClubs] = useState(null);
  const userPassObject = { user: user, setUser: setUser }
  const eventsPassObject = { events: events, setEvents: setEvents }
  const usersPassObject = { users: users, setUsers: setUsers }
  const clubsPassObject = { clubs: clubs, setClubs: setClubs }

  return (
    <>
      <Navbar user={user} />
      <Routes> 
        <Route path="/" element={ <Home user={userPassObject} events={eventsPassObject} /> } />
        <Route path="/events" element={ <Events user={userPassObject} events={eventsPassObject}/> } />
        <Route path="/events/:id" element={ <EventPage user={userPassObject} clubs={clubsPassObject} events={eventsPassObject}/> } />
        <Route path="/events/:id/scan" element={ <ScanUsers/> } />
        <Route path="/profile" element={ <Profile user={userPassObject} events={eventsPassObject} clubs={clubsPassObject}/> } />
        <Route path="/login" element={ <Login users={usersPassObject} setUser={setUser}/> } />
        <Route path="/leaderboard" element={<Leaderboard user={user} users={usersPassObject} />} />
        <Route path="/clubs" element={<Clubs clubs={clubsPassObject} user={userPassObject} />} />
        <Route path="/clubs/:id" element={ <ClubPage user={userPassObject} clubs={clubsPassObject} /> } />
        <Route path="/clubs/:id/create-event" element={ <CreateEvent user={userPassObject} clubs={clubsPassObject} /> } />
      </Routes>
    </>
  );
} 

export default App;