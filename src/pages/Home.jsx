import { Link } from 'react-router-dom';

function Home({ currentUser }) {
  return (
    <>
      <section className="hero-section mb-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="text-uppercase fw-semibold mb-2 opacity-75">
              College Registration Made Simple
            </p>
            <h1 className="display-5 fw-bold mb-3">
              Manage courses, teaching, and schedules in one place.
            </h1>
            <p className="lead mb-4">
              MyCourse Portal is a clean college registration app where teachers
              manage course offerings and students browse, enroll, and organize
              their schedules.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/courses" className="btn btn-light btn-lg px-4">
                Browse Courses
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                Sign In
              </Link>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card soft-card bg-white text-dark">
              <div className="card-body p-4">
                <h3 className="brand-gradient mb-3">Portal Features</h3>
                <div className="d-grid gap-3">
                  <div>
                    <div className="fw-semibold">Teachers</div>
                    <div className="text-secondary">
                      Create, edit, delete, and manage courses you own.
                    </div>
                  </div>
                  <div>
                    <div className="fw-semibold">Students</div>
                    <div className="text-secondary">
                      Search courses, add them to your schedule, and drop them
                      easily.
                    </div>
                  </div>
                  <div>
                    <div className="fw-semibold">Designed UI</div>
                    <div className="text-secondary">
                      Bootstrap layout, color theme, cards, badges, and a
                      polished navbar.
                    </div>
                  </div>
                </div>

                {currentUser && (
                  <div className="alert alert-success mt-4 mb-0">
                    Logged in as <strong>{currentUser.name}</strong> (
                    {currentUser.role})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-md-4">
          <div className="card soft-card h-100">
            <div className="card-body p-4">
              <div className="feature-icon mb-3 text-white bg-primary">1</div>
              <h4>Easy Navigation</h4>
              <p className="text-secondary mb-0">
                A top navbar provides fast access to Home, Courses, Login, My
                Schedule, and Teacher Panel.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card soft-card h-100">
            <div className="card-body p-4">
              <div className="feature-icon mb-3 text-white bg-success">2</div>
              <h4>Course Discovery</h4>
              <p className="text-secondary mb-0">
                Students can search by course number or name and quickly review
                course descriptions and credits.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card soft-card h-100">
            <div className="card-body p-4">
              <div className="feature-icon mb-3 text-white bg-warning">3</div>
              <h4>Teacher Controls</h4>
              <p className="text-secondary mb-0">
                Teachers have a dedicated dashboard for managing only the
                courses they created.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;