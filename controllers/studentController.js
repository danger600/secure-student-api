const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// Create Student
const createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, rollNumber, grade, dateOfBirth, phoneNumber, address, parentName, parentPhone } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }

    const student = new Student({
      firstName,
      lastName,
      email,
      rollNumber,
      grade,
      dateOfBirth,
      phoneNumber,
      address,
      parentName,
      parentPhone,
      createdBy: req.user.id
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find({ isActive: true })
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ enrollmentDate: -1 });

    const total = await Student.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students',
      error: error.message
    });
  }
};

// Get Student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student',
      error: error.message
    });
  }
};

// Update Student
const updateStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

// Delete Student (Soft Delete)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};

// Search Students
const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const students = await Student.find({
      isActive: true,
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { rollNumber: { $regex: query, $options: 'i' } }
      ]
    }).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Found ${students.length} student(s)`,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search students',
      error: error.message
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents
};
