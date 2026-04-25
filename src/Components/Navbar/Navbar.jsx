import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const BASE_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/clubs', label: 'Clubs' },
]

const ADMIN_LINKS = [{ to: '/admin', label: 'Admin' }]

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

function Navbar ({ user }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const loggedIn = Boolean(user)
  const isAdmin = user?.type === 'admin'
  const navLinks = isAdmin ? [...BASE_NAV_LINKS, ...ADMIN_LINKS] : BASE_NAV_LINKS

  return (
    <>
      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <img src="https://ozarkstech.edu/wp-content/uploads/2025/10/ozarks-tech-wordmark.webp" />
          </Link>

          <div className="nav-links">
            {navLinks.map(l => <NavLink key={l.to} {...l} />)}
          </div>

          <div className="nav-actions">
            {loggedIn ? (
              <>
                {!isAdmin && (
                  <div className="points-badge">
                    <span className="coin">🪙</span>
                    {user.points} pts
                  </div>
                )}

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
          {navLinks.map(l => (
            <NavLink key={l.to} {...l} />
          ))}

          <div className="mobile-actions">
            {loggedIn ? (
              <>
                {!isAdmin && (
                  <div className="points-badge">
                    <span className="coin">🪙</span>
                    {user.points} pts
                  </div>
                )}

                <Link to="/profile" className="profile-btn" onClick={close}>
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