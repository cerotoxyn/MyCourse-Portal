import { useState } from 'react';
import { Link } from 'react-router-dom';

function TeacherDashboard({ currentUser, courses, setCourses }) {
  const [form, setForm] = useState({
    courseNumber: '',
    courseName: '',
    description: '',
    subjectArea: '',
    credits: 3,
  });
  const [editingId, setEditingId] = useState(null);

  if (!currentUser || currentUser.role !== 'teacher') {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card soft-card">
            <div className="card-body p-5 text-center">
              <h2 className="page-title mb-3">Teacher access only</h2>
              <p className="text-secondary mb-4">
                Log in as a teacher to create, edit, and delete courses.
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

  const teacherCourses = courses.filter(
    (course) => course.teacherId === currentUser.id
  );

  const resetForm = () => {
    setForm({
      courseNumber: '',
      courseName: '',
      description: '',
      subjectArea: '',
      credits: 3,
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingId
            ? {
                ...course,
                ...form,
                credits: Number(form.credits),
              }
            : course
        )
      );
    } else {
      setCourses((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ...form,
          credits: Number(form.credits),
          teacherId: currentUser.id,
          teacherName: currentUser.name,
        },
      ]);
    }

    resetForm();
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setForm({
      courseNumber: course.courseNumber,
      courseName: course.courseName,
      description: course.description,
      subjectArea: course.subjectArea,
      credits: course.credits,
    });
  };

  const deleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
    if (editingId === courseId) resetForm();
  };

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="card soft-card">
          <div className="card-body p-4">
            <h2 className="page-title mb-3">
              {editingId ? 'Edit Course' : 'Create Course'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Course Number</label>
                <input
                  className="form-control"
                  value={form.courseNumber}
                  onChange={(e) =>
                    setForm({ ...form, courseNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Course Name</label>
                <input
                  className="form-control"
                  value={form.courseName}
                  onChange={(e) =>
                    setForm({ ...form, courseName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Subject Area</label>
                  <input
                    className="form-control"
                    value={form.subjectArea}
                    onChange={(e) =>
                      setForm({ ...form, subjectArea: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    className="form-control"
                    value={form.credits}
                    onChange={(e) =>
                      setForm({ ...form, credits: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Course' : 'Create Course'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card soft-card">
          <div className="card-body p-4">
            <h2 className="page-title mb-3">My Courses</h2>

            {teacherCourses.length === 0 ? (
              <div className="alert alert-info mb-0">
                You have not created any courses yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Subject</th>
                      <th>Credits</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherCourses.map((course) => (
                      <tr key={course.id}>
                        <td>
                          <div className="fw-semibold">
                            {course.courseNumber}
                          </div>
                          <div className="text-secondary small">
                            {course.courseName}
                          </div>
                        </td>
                        <td>{course.subjectArea}</td>
                        <td>{course.credits}</td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => startEdit(course)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteCourse(course.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;