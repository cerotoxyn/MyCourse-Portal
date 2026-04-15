import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import TeacherDashboard from './pages/TeacherDashboard';

const sampleCourses = [
  {
    id: 1,
    courseNumber: 'CSCI 101',
    courseName: 'Intro to Programming',
    description: 'Learn programming fundamentals using problem solving and basic software design.',
    subjectArea: 'Computer Science',
    credits: 3,
    teacherId: 101,
    teacherName: 'Prof. Rivera',
  },
  {
    id: 2,
    courseNumber: 'MATH 210',
    courseName: 'Calculus I',
    description: 'Limits, derivatives, applications, and introductory integration.',
    subjectArea: 'Mathematics',
    credits: 4,
    teacherId: 102,
    teacherName: 'Prof. Patel',
  },
  {
    id: 3,
    courseNumber: 'ENG 201',
    courseName: 'College Writing',
    description: 'Develop argument-driven writing, revision habits, and research skills.',
    subjectArea: 'English',
    credits: 3,
    teacherId: 103,
    teacherName: 'Prof. Lawson',
  },
  {
    id: 4,
    courseNumber: 'BIO 115',
    courseName: 'General Biology',
    description: 'Introduction to biological systems, genetics, cells, and evolution.',
    subjectArea: 'Biology',
    credits: 4,
    teacherId: 101,
    teacherName: 'Prof. Rivera',
  },
];

const initialUsers = [
  {
    id: 101,
    name: 'Elena Rivera',
    email: 'teacher@portal.edu',
    password: 'pass123',
    role: 'teacher',
  },
  {
    id: 201,
    name: 'Jordan Lee',
    email: 'student@portal.edu',
    password: 'pass123',
    role: 'student',
  },
];

function App() {
  const [users] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState(sampleCourses);
  const [enrollments, setEnrollments] = useState([
    { id: 1, studentId: 201, courseId: 2 },
  ]);

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
                users={users}
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
                setCourses={setCourses}
                enrollments={enrollments}
                setEnrollments={setEnrollments}
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
              />
            }
          />
          <Route
            path="/teacher"
            element={
              <TeacherDashboard
                currentUser={currentUser}
                courses={courses}
                setCourses={setCourses}
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