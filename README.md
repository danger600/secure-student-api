# 🎓 Secure Student Management RESTful API

A production-ready, secure RESTful API built with Node.js and Express.js for managing student records at Smart Learning Center. The system includes comprehensive authentication, authorization, password hashing, and environment variable management.

---

## ✨ Features

✅ **User Authentication**
- User registration with email validation
- Secure login with JWT token generation
- Password hashing using bcryptjs (10 rounds)
- Token-based authentication for all protected routes

✅ **Authorization & Access Control**
- Role-based access control (Admin, Staff, User)
- Different permission levels for CRUD operations
- Admin-only operations for sensitive actions

✅ **Student Management**
- Complete CRUD operations (Create, Read, Update, Delete)
- Soft delete functionality (maintain data integrity)
- Student search and filtering
- Pagination support for large datasets
- Validation for all student fields

✅ **Security Best Practices**
- Environment variable configuration
- Password hashing before storage
- JWT token validation
- CORS protection
- Input validation and sanitization
- HTTP error handling

✅ **Database**
- MongoDB integration with Mongoose ODM
- Automatic timestamps (createdAt, updatedAt)
- Data relationships and references

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **CORS:** cors middleware
- **Environment:** dotenv

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/danger600/secure-student-api.git
   cd secure-student-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart_learning_center
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   BCRYPT_ROUNDS=10
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

Server will start at: `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

### 🔐 Authentication Endpoints

#### 1. User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64a1f2b3c4d5e6f7g8h9i0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "64a1f2b3c4d5e6f7g8h9i0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📖 Student Management Endpoints

**Authorization Header Required:**
```
Authorization: Bearer <your_jwt_token>
```

#### 1. Create Student
**POST** `/students`

**Required Role:** Admin or Staff

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice@example.com",
  "rollNumber": "STU001",
  "grade": "A",
  "dateOfBirth": "2005-06-15",
  "phoneNumber": "+1234567890",
  "address": "123 Main St, City, Country",
  "parentName": "Robert Smith",
  "parentPhone": "+1234567891"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "64a1f2b3c4d5e6f7g8h9i1",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "rollNumber": "STU001",
    "grade": "A",
    "dateOfBirth": "2005-06-15T00:00:00.000Z",
    "phoneNumber": "+1234567890",
    "address": "123 Main St, City, Country",
    "parentName": "Robert Smith",
    "parentPhone": "+1234567891",
    "isActive": true,
    "enrollmentDate": "2026-05-11T10:30:00.000Z",
    "createdBy": "64a1f2b3c4d5e6f7g8h9i0",
    "updatedAt": "2026-05-11T10:30:00.000Z"
  }
}
```

#### 2. Get All Students
**GET** `/students`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "64a1f2b3c4d5e6f7g8h9i1",
      "firstName": "Alice",
      "lastName": "Smith",
      "email": "alice@example.com",
      "rollNumber": "STU001",
      "grade": "A",
      "isActive": true,
      "enrollmentDate": "2026-05-11T10:30:00.000Z",
      "createdBy": {
        "_id": "64a1f2b3c4d5e6f7g8h9i0",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### 3. Search Students
**GET** `/students/search?query=alice`

**Query Parameters:**
- `query` (required): Search term (searches firstName, lastName, email, rollNumber)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Found 1 student(s)",
  "data": [
    {
      "_id": "64a1f2b3c4d5e6f7g8h9i1",
      "firstName": "Alice",
      "lastName": "Smith",
      "email": "alice@example.com",
      "rollNumber": "STU001",
      "grade": "A",
      "isActive": true
    }
  ]
}
```

#### 4. Get Student by ID
**GET** `/students/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "_id": "64a1f2b3c4d5e6f7g8h9i1",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "rollNumber": "STU001",
    "grade": "A",
    "dateOfBirth": "2005-06-15T00:00:00.000Z",
    "phoneNumber": "+1234567890",
    "address": "123 Main St, City, Country",
    "parentName": "Robert Smith",
    "parentPhone": "+1234567891",
    "isActive": true,
    "enrollmentDate": "2026-05-11T10:30:00.000Z",
    "createdBy": {
      "_id": "64a1f2b3c4d5e6f7g8h9i0",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### 5. Update Student
**PUT** `/students/:id`

**Required Role:** Admin or Staff

**Request Body (any field to update):**
```json
{
  "grade": "A+",
  "phoneNumber": "+1234567899"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "64a1f2b3c4d5e6f7g8h9i1",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "grade": "A+",
    "phoneNumber": "+1234567899",
    "updatedAt": "2026-05-11T11:45:00.000Z"
  }
}
```

#### 6. Delete Student
**DELETE** `/students/:id`

**Required Role:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "_id": "64a1f2b3c4d5e6f7g8h9i1",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "isActive": false
  }
}
```

---

## 🔒 Security Features

### 1. Password Hashing
- Passwords are hashed using bcryptjs with 10 salt rounds
- Passwords are never stored in plain text
- Passwords are not returned in API responses

### 2. JWT Authentication
- Tokens expire after 7 days (configurable)
- Tokens are validated on all protected routes
- Invalid or expired tokens return 401 Unauthorized

### 3. Role-Based Authorization
- **Admin:** Can perform all operations including deleting students
- **Staff:** Can create, read, and update students
- **User:** Can only read student data

### 4. Input Validation
- All inputs are validated using express-validator
- Email format validation
- Password length requirements
- Grade enum validation
- Phone number format validation

### 5. Environment Variables
- Sensitive data stored in `.env` file
- Never commit `.env` to version control
- Use `.env.example` for documentation

### 6. CORS Protection
- Configurable CORS origin
- Credentials allowed for cross-origin requests

---

## 🧪 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "admin"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Create a student (replace TOKEN with your JWT):**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "rollNumber": "STU001",
    "grade": "A",
    "dateOfBirth": "2005-06-15",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "parentName": "Robert Smith",
    "parentPhone": "+1234567891"
  }'
```

**Get all students:**
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer TOKEN"
```

---

## 📁 Project Structure

```
secure-student-api/
├── server.js                 # Main application entry point
├── package.json              # Project dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
├── config/
│   └── database.js           # MongoDB connection configuration
├── models/
│   ├── User.js               # User schema with password hashing
│   └── Student.js            # Student schema
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── studentController.js  # Student CRUD operations
├── routes/
│   ├── auth.js               # Authentication routes
│   └── students.js           # Student management routes
└── middleware/
    └── auth.js               # JWT authentication & authorization
```

---

## 🚀 Deployment

### Environment-Specific Configuration

**Production Environment:**
```env
NODE_ENV=production
PORT=8000
JWT_SECRET=use_a_very_strong_secret_key
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smart_learning_center
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Platforms
- **Heroku:** `git push heroku main`
- **Railway:** Connect GitHub repository
- **Render:** Deploy from GitHub
- **AWS, Azure, GCP:** Use Docker containers

---

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized / Invalid Token
- `403` - Forbidden / Insufficient Permission
- `404` - Not Found
- `500` - Server Error

---

## 📝 Best Practices Implemented

✅ RESTful API design principles
✅ Stateless authentication with JWT
✅ Proper HTTP status codes
✅ Comprehensive input validation
✅ Password hashing and security
✅ Role-based access control
✅ Environment variable management
✅ Error handling and logging
✅ CORS protection
✅ Soft delete for data integrity
✅ Pagination for large datasets
✅ Code organization and modularity

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 👨‍💼 Support

For issues or questions:
1. Check the API documentation above
2. Review error messages carefully
3. Ensure MongoDB is running
4. Verify environment variables are set correctly
5. Check server logs for detailed error information

---

## 🎓 Educational Purpose

This project was built as part of the Smart Learning Center's digital transformation initiative. It demonstrates:
- Secure API design
- Authentication & Authorization
- Database modeling
- REST principles
- Node.js/Express best practices

---

**Version:** 1.0.0  
**Last Updated:** 2026-05-11  
**Status:** Production Ready ✅
