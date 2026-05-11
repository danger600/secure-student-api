const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents
} = require('../controllers/studentController');

const router = express.Router();

// All student routes require authentication
router.use(authenticate);

// Create Student
router.post('/', authorize(['admin', 'staff']), [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('rollNumber').notEmpty().withMessage('Roll number is required'),
  body('grade').isIn(['A', 'B', 'C', 'D', 'F']).withMessage('Valid grade is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('parentName').notEmpty().withMessage('Parent name is required'),
  body('parentPhone').notEmpty().withMessage('Parent phone is required')
], createStudent);

// Get All Students
router.get('/', getAllStudents);

// Search Students
router.get('/search', searchStudents);

// Get Student by ID
router.get('/:id', getStudentById);

// Update Student
router.put('/:id', authorize(['admin', 'staff']), updateStudent);

// Delete Student
router.delete('/:id', authorize(['admin']), deleteStudent);

module.exports = router;
