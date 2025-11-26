/**
 * Hypothetical backend service for the SBS Academy Parent Portal.
 * Built with Express to illustrate how portal widgets could be powered.
 *
 * NOTE: This is sample code for reference/testing only.
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const students = [
  {
    admissionNo: 'SBS2025/087',
    name: 'Ananya Pratap',
    class: 'VIII B',
    parents: 'Mr. & Mrs. Pratap',
    contact: '+91 9876543210',
    attendance: 94,
    feesPaidPercent: 75,
    assignmentsPending: 3,
    nextFeeDue: '2025-01-15',
    sessions: [
      { subject: 'Mathematics', time: '10:00 AM', link: 'https://zoom.example/maths' },
      { subject: 'Science', time: '12:30 PM', link: 'https://zoom.example/science' },
    ],
    credentials: {
      password: 'Ananya@123',
    },
  },
  {
    admissionNo: 'SBS2025/102',
    name: 'Devika Singh',
    class: 'VII A',
    parents: 'Mr. & Mrs. Singh',
    contact: '+91 9812345670',
    attendance: 97,
    feesPaidPercent: 100,
    assignmentsPending: 1,
    nextFeeDue: '2025-04-15',
    sessions: [
      { subject: 'English', time: '9:30 AM', link: 'https://zoom.example/english' },
      { subject: 'EVS', time: '11:30 AM', link: 'https://zoom.example/evs' },
    ],
    credentials: {
      password: 'Devika@123',
    },
  },
  {
    admissionNo: 'SBS2025/134',
    name: 'Kabir Sharma',
    class: 'IX C',
    parents: 'Mr. & Mrs. Sharma',
    contact: '+91 9090909090',
    attendance: 90,
    feesPaidPercent: 50,
    assignmentsPending: 5,
    nextFeeDue: '2024-12-31',
    sessions: [
      { subject: 'Physics', time: '8:30 AM', link: 'https://zoom.example/physics' },
      { subject: 'Chemistry', time: '11:00 AM', link: 'https://zoom.example/chemistry' },
    ],
    credentials: {
      password: 'Kabir@123',
    },
  },
];

const feeLedger = {
  'SBS2025/087': [
    { term: 'Q1', amount: 19500, paidOn: '2024-04-12', mode: 'UPI' },
    { term: 'Q2', amount: 19500, paidOn: '2024-07-10', mode: 'NetBanking' },
    { term: 'Q3', amount: 19500, paidOn: null, mode: null },
    { term: 'Q4', amount: 19500, paidOn: null, mode: null },
  ],
  'SBS2025/102': [
    { term: 'Q1', amount: 18000, paidOn: '2024-04-08', mode: 'UPI' },
    { term: 'Q2', amount: 18000, paidOn: '2024-07-05', mode: 'Card' },
    { term: 'Q3', amount: 18000, paidOn: '2024-10-06', mode: 'UPI' },
    { term: 'Q4', amount: 18000, paidOn: '2025-01-03', mode: 'UPI' },
  ],
  'SBS2025/134': [
    { term: 'Q1', amount: 21000, paidOn: '2024-04-20', mode: 'Cash' },
    { term: 'Q2', amount: 21000, paidOn: null, mode: null },
    { term: 'Q3', amount: 21000, paidOn: null, mode: null },
    { term: 'Q4', amount: 21000, paidOn: null, mode: null },
  ],
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/', (_, res) => {
  res.json({
    status: 'ok',
    message: 'SBS Academy Portal backend is running.',
  });
});

app.get('/api/students', (_, res) => {
  res.json(students);
});

app.get('/api/students/:admissionNo', (req, res) => {
  const student = students.find(
    (item) => item.admissionNo.toLowerCase() === req.params.admissionNo.toLowerCase(),
  );
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  return res.json(student);
});

app.get('/api/students/:admissionNo/fees', (req, res) => {
  const ledger = feeLedger[req.params.admissionNo];
  if (!ledger) {
    return res.status(404).json({ error: 'Fee records not found' });
  }
  return res.json(ledger);
});

app.post('/api/login', (req, res) => {
  const { admissionNo, password } = req.body || {};

  if (!admissionNo || !password) {
    return res.status(400).json({ error: 'Missing admission number or password' });
  }

  const student = students.find(
    (item) => item.admissionNo.toLowerCase() === (admissionNo || '').toLowerCase(),
  );
  if (!student) {
    return res.status(401).json({ error: 'Invalid admission number or password' });
  }

  if (student.credentials.password !== password) {
    return res.status(401).json({ error: 'Invalid admission number or password' });
  }

  return res.json({
    token: 'mock-jwt-token',
    student: {
      admissionNo: student.admissionNo,
      name: student.name,
      class: student.class,
      attendance: student.attendance,
      feesPaidPercent: student.feesPaidPercent,
      assignmentsPending: student.assignmentsPending,
    },
    sessions: student.sessions,
  });
});

// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`SBS Academy backend running on http://localhost:${PORT}`);
});

