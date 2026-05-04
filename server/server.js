import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coursesFile = path.join(__dirname, 'data', 'courses.json');
const usersFile = path.join(__dirname, 'data', 'users.json');
const enrollmentsFile = path.join(__dirname, 'data', 'enrollments.json');

app.use(cors());
app.use(express.json());

async function readJson(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readCourses() {
  return readJson(coursesFile);
}

async function writeCourses(courses) {
  await writeJson(coursesFile, courses);
}

async function readUsers() {
  return readJson(usersFile);
}

async function readEnrollments() {
  return readJson(enrollmentsFile);
}

async function writeEnrollments(enrollments) {
  await writeJson(enrollmentsFile, enrollments);
}

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();

    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await readCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read courses' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const courses = await readCourses();
    const course = courses.find((c) => c.id === Number(req.params.id));

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read course' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const {
      courseNumber,
      courseName,
      description,
      subjectArea,
      credits,
      teacherId,
      teacherName,
      role,
    } = req.body;

    if (role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create courses' });
    }

    if (!courseNumber || !courseName || !description || !subjectArea || !credits) {
      return res.status(400).json({ error: 'All course fields are required' });
    }

    const courses = await readCourses();

    const newCourse = {
      id: courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1,
      courseNumber,
      courseName,
      description,
      subjectArea,
      credits: Number(credits),
      teacherId,
      teacherName,
    };

    courses.push(newCourse);
    await writeCourses(courses);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    if (req.body.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can update courses' });
    }

    const courses = await readCourses();
    const index = courses.findIndex((c) => c.id === Number(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    courses[index] = {
      ...courses[index],
      ...req.body,
      id: courses[index].id,
      credits: Number(req.body.credits ?? courses[index].credits),
    };

    await writeCourses(courses);
    res.json(courses[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    if (req.body.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can delete courses' });
    }

    const courses = await readCourses();
    const filteredCourses = courses.filter((c) => c.id !== Number(req.params.id));

    if (filteredCourses.length === courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await writeCourses(filteredCourses);

    const enrollments = await readEnrollments();
    const filteredEnrollments = enrollments.filter(
      (enrollment) => enrollment.courseId !== Number(req.params.id)
    );
    await writeEnrollments(filteredEnrollments);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

app.get('/api/enrollments/:studentId', async (req, res) => {
  try {
    const enrollments = await readEnrollments();
    const studentEnrollments = enrollments.filter(
      (enrollment) => enrollment.studentId === Number(req.params.studentId)
    );
    res.json(studentEnrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read enrollments' });
  }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    const { studentId, courseId, role } = req.body;

    if (role !== 'student') {
      return res.status(403).json({ error: 'Only students can add courses to schedule' });
    }

    const enrollments = await readEnrollments();

    const alreadyExists = enrollments.some(
      (enrollment) =>
        enrollment.studentId === Number(studentId) &&
        enrollment.courseId === Number(courseId)
    );

    if (alreadyExists) {
      return res.status(400).json({ error: 'Course already added to schedule' });
    }

    const newEnrollment = {
      id: enrollments.length ? Math.max(...enrollments.map((e) => e.id)) + 1 : 1,
      studentId: Number(studentId),
      courseId: Number(courseId),
    };

    enrollments.push(newEnrollment);
    await writeEnrollments(enrollments);

    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course to schedule' });
  }
});

app.delete('/api/enrollments', async (req, res) => {
  try {
    const { studentId, courseId, role } = req.body;

    if (role !== 'student') {
      return res.status(403).json({ error: 'Only students can remove courses from schedule' });
    }

    const enrollments = await readEnrollments();
    const filtered = enrollments.filter(
      (enrollment) =>
        !(
          enrollment.studentId === Number(studentId) &&
          enrollment.courseId === Number(courseId)
        )
    );

    if (filtered.length === enrollments.length) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    await writeEnrollments(filtered);
    res.json({ message: 'Course removed from schedule' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove course from schedule' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});