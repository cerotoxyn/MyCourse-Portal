import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'student') {
      fetchEnrollments(currentUser.id);
    } else {
      setEnrollments([]);
    }
  }, [currentUser]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setCourseError('');
      const response = await fetch('http://localhost:5000/api/courses');

      if (!response.ok) {
        throw new Error('Failed to load courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setCourseError('Could not connect to backend courses API.');
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchEnrollments = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/enrollments/${studentId}`);

      if (!response.ok) {
        throw new Error('Failed to load enrollments');
      }

      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      setEnrollments([]);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home currentUser={currentUser} />} />
          <Route
            path="/login"
            element={
              <Login
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/courses"
            element={
              <Courses
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                setEnrollments={setEnrollments}
                loadingCourses={loadingCourses}
                courseError={courseError}
                fetchCourses={fetchCourses}
                fetchEnrollments={fetchEnrollments}
              />
            }
          />
          <Route
            path="/schedule"
            element={
              <Schedule
                currentUser={currentUser}
                courses={courses}
                enrollments={enrollments}
                setEnrollments={setEnrollments}
                fetchEnrollments={fetchEnrollments}
              />
            }
          />
          <Route
            path="/teacher"
            element={
              <TeacherDashboard
                currentUser={currentUser}
                courses={courses}
                fetchCourses={fetchCourses}
                loadingCourses={loadingCourses}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="container pb-4 pt-2 custom-footer text-center">
        <hr />
        <p className="mb-0">
          MyCourse Portal · Final Project Starter · Built with React + Bootstrap
        </p>
      </footer>
    </div>
  );
}

export default App;