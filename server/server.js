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

app.use(cors());
app.use(express.json());

async function readCourses() {
  const data = await fs.readFile(coursesFile, 'utf-8');
  return JSON.parse(data);
}

async function writeCourses(courses) {
  await fs.writeFile(coursesFile, JSON.stringify(courses, null, 2));
}

async function readUsers() {
  const data = await fs.readFile(usersFile, 'utf-8');
  return JSON.parse(data);
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
    const filtered = courses.filter((c) => c.id !== Number(req.params.id));

    if (filtered.length === courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await writeCourses(filtered);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});