import { Link } from 'react-router-dom';

function Schedule({ currentUser, courses, enrollments, setEnrollments }) {
  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card soft-card">
            <div className="card-body p-5 text-center">
              <h2 className="page-title mb-3">Student access only</h2>
              <p className="text-secondary mb-4">
                Log in as a student to view and manage your course schedule.
              </p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const myCourses = enrollments
    .filter((enrollment) => enrollment.studentId === currentUser.id)
    .map((enrollment) => courses.find((course) => course.id === enrollment.courseId))
    .filter(Boolean);

  const dropCourse = (courseId) => {
    setEnrollments((prev) =>
      prev.filter(
        (enrollment) => !(enrollment.studentId === currentUser.id && enrollment.courseId === courseId)
      )
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="page-title mb-1">My Schedule</h2>
        <p className="text-secondary mb-0">Courses currently added to your schedule.</p>
      </div>

      {myCourses.length === 0 ? (
        <div className="alert alert-info">No courses added yet. Visit the Courses page to enroll.</div>
      ) : (
        <div className="row g-4">
          {myCourses.map((course) => (
            <div className="col-lg-6" key={course.id}>
              <div className="card soft-card h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                    <div>
                      <div className="text-primary fw-semibold">{course.courseNumber}</div>
                      <h4 className="mb-1">{course.courseName}</h4>
                    </div>
                    <span className="badge text-bg-primary">{course.credits} credits</span>
                  </div>

                  <p className="text-secondary">{course.description}</p>

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span className="badge text-bg-light border">{course.subjectArea}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => dropCourse(course.id)}>
                      Drop Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedule;