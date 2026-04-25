import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  {to: '/', label: 'Home'},
  {to: '/events', label: 'Events'},
  {to: '/leaderboard', label: 'Leaderboard'},
  {to: '/clubs', label: 'Clubs'},
]

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function NavLink({ to, label }) {
  const { pathname } = useLocation()
  return (
    <Link to={to} className={`nav-link${pathname === to ? ' active' : ''}`}>
      {label}
    </Link>
  )
}

function Navbar ({user}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const loggedIn = Boolean(user)

  return (
    <>
      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <img src="https://ozarkstech.edu/wp-content/uploads/2025/10/ozarks-tech-wordmark.webp"/>
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map(l => <NavLink key={l.to} {...l} />)}
          </div>

          <div className="nav-actions">
            {loggedIn ? (
              <>
                <div className="points-badge">
                  <span className="coin">🪙</span>
                  {user.points} pts
                </div>
                <Link to="/profile" className="profile-btn">
                  <div className="avatar">{getInitials(user.username)}</div>
                  My Profile
                </Link>
              </>
            ) : (
              <Link to="/login" className="login-btn">
                Sign In
              </Link>
            )}
          </div>

          <button
            className={`hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`mobile-menu${open ? ' open' : ''}`}>
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} {...l} />
          ))}
          <div className="mobile-actions">
            {loggedIn ? (
              <>
                <div className="points-badge">
                  <span className="coin">🪙</span>
                  {user.points} pts
                </div>
                <Link to="/profile" className="profile-btn">
                  <div className="avatar">{getInitials(user.username)}</div>
                  My Profile
                </Link>
              </>
            ) : (
              <Link to="/login" className="login-btn" onClick={close}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar;