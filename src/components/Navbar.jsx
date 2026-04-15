import { Link, NavLink } from 'react-router-dom';

function Navbar({ currentUser, setCurrentUser }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top nav-shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          MyCourse Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link px-3" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link px-3" to="/courses">
              Courses
            </NavLink>

            {currentUser?.role === 'student' && (
              <NavLink className="nav-link px-3" to="/schedule">
                My Schedule
              </NavLink>
            )}

            {currentUser?.role === 'teacher' && (
              <NavLink className="nav-link px-3" to="/teacher">
                Teacher Panel
              </NavLink>
            )}

            {!currentUser ? (
              <NavLink className="btn btn-primary ms-lg-2 mt-2 mt-lg-0" to="/login">
                Login
              </NavLink>
            ) : (
              <button
                className="btn btn-outline-light ms-lg-2 mt-2 mt-lg-0"
                onClick={() => setCurrentUser(null)}
              >
                Logout ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;