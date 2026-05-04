import { useMemo, useState } from 'react';

function Courses({
  currentUser,
  courses,
  enrollments,
  setEnrollments,
  loadingCourses,
  courseError,
  fetchCourses,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const term = searchTerm.toLowerCase();
      return (
        course.courseName.toLowerCase().includes(term) ||
        course.courseNumber.toLowerCase().includes(term)
      );
    });
  }, [courses, searchTerm]);

  const isEnrolled = (courseId) => {
    if (!currentUser || currentUser.role !== 'student') return false;

    return enrollments.some(
      (enrollment) =>
        enrollment.studentId === currentUser.id && enrollment.courseId === courseId
    );
  };

  const addToSchedule = (courseId) => {
    if (!currentUser || currentUser.role !== 'student') return;
    if (isEnrolled(courseId)) return;

    setEnrollments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        studentId: currentUser.id,
        courseId,
      },
    ]);
  };

  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setDeleteMessage('Course deleted successfully.');
      await fetchCourses();
    } catch (error) {
      setDeleteMessage('Unable to delete course right now.');
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">Course Catalog</h2>
          <p className="text-secondary mb-0">
            Browse, search, and manage available courses.
          </p>
        </div>

        <div className="col-md-4 px-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search by course name or number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {courseError && <div className="alert alert-danger">{courseError}</div>}
      {deleteMessage && <div className="alert alert-info">{deleteMessage}</div>}
      {loadingCourses && <div className="alert alert-secondary">Loading courses...</div>}

      {!loadingCourses && filteredCourses.length === 0 ? (
        <div className="alert alert-info">No courses found.</div>
      ) : (
        <div className="row g-4">
          {filteredCourses.map((course) => {
            const teacherOwnsCourse =
              currentUser?.role === 'teacher' && currentUser.id === course.teacherId;

            return (
              <div className="col-lg-6" key={course.id}>
                <div className="card soft-card h-100">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
                      <div>
                        <div className="text-primary fw-semibold">{course.courseNumber}</div>
                        <h4 className="mb-1">{course.courseName}</h4>
                        <div className="text-secondary">Instructor: {course.teacherName}</div>
                      </div>
                      <span className="course-badge">{course.credits} Credits</span>
                    </div>

                    <p className="text-secondary flex-grow-1">{course.description}</p>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
                      <span className="badge text-bg-light border">{course.subjectArea}</span>

                      <div className="d-flex gap-2 flex-wrap">
                        {currentUser?.role === 'student' && (
                          <button
                            className={`btn btn-sm ${
                              isEnrolled(course.id) ? 'btn-success' : 'btn-primary'
                            }`}
                            onClick={() => addToSchedule(course.id)}
                            disabled={isEnrolled(course.id)}
                          >
                            {isEnrolled(course.id) ? 'Added' : 'Add to Schedule'}
                          </button>
                        )}

                        {teacherOwnsCourse && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteCourse(course.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Courses;