# API Documentation

Complete API reference for all endpoints.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-app.vercel.app/api
```

## Authentication

Most admin endpoints require JWT authentication.

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Get Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "admin": {
      "id": "clp123...",
      "name": "Ahmed Senouci",
      "email": "admin@example.com"
    }
  }
}
```

## Auth Endpoints

### POST /api/auth/login

Authenticate admin user.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "admin": { "id": "...", "name": "...", "email": "..." }
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

### POST /api/auth/register

Create new admin user (admin only).

**Request:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "password123"
}
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "clp123...",
    "name": "New Admin",
    "email": "newadmin@example.com"
  }
}
```

**Errors:**
- `400` - Missing fields or invalid format
- `401` - Unauthorized (missing token)
- `409` - Email already in use

---

## Formation Endpoints

### GET /api/formations

List all formations with statistics.

**Query Parameters:**
```
None
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clp123...",
      "name": "Full-Stack Web Development",
      "description": "Master modern web technologies...",
      "category": "Development",
      "duration": "6 months",
      "status": "Active",
      "_count": {
        "students": 15,
        "inscriptions": 18
      },
      "createdAt": "2026-02-01T10:00:00Z",
      "updatedAt": "2026-02-01T10:00:00Z"
    }
  ]
}
```

### GET /api/formations/[id]

Get single formation with details.

**Path Parameters:**
```
id: Formation ID
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clp123...",
    "name": "Full-Stack Web Development",
    "description": "...",
    "category": "Development",
    "duration": "6 months",
    "status": "Active",
    "students": [
      {
        "id": "clp456...",
        "email": "student@example.com",
        "type": "Individual"
      }
    ],
    "inscriptions": [
      {
        "id": "clp789...",
        "status": "Pending"
      }
    ],
    "createdAt": "2026-02-01T10:00:00Z",
    "updatedAt": "2026-02-01T10:00:00Z"
  }
}
```

**Errors:**
- `404` - Formation not found

### POST /api/formations/create

Create new formation (admin only).

**Request:**
```json
{
  "name": "Advanced Python",
  "description": "Master Python programming",
  "category": "Development",
  "duration": "4 months",
  "status": "Active"
}
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Formation created successfully",
  "data": {
    "id": "clp999...",
    "name": "Advanced Python",
    "description": "Master Python programming",
    "category": "Development",
    "duration": "4 months",
    "status": "Active",
    "createdAt": "2026-02-17T12:00:00Z",
    "updatedAt": "2026-02-17T12:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Unauthorized
- `409` - Formation name already exists

---

## Enrollment Endpoints

### POST /api/enroll

Submit enrollment request (public).

**Request:**
```json
{
  "accountType": "Individual",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "dateOfBirth": "1995-05-15",
  "selectedProgram": "Full-Stack Web Development",
  "startDate": "2026-03-01",
  "agreeTerms": true
}
```

**For Company:**
```json
{
  "accountType": "Company",
  "companyName": "TechCorp",
  "companyStudentCount": "5",
  "companyContactName": "Jane Smith",
  "companyContactEmail": "contact@techcorp.com",
  "companyPhone": "+1 (555) 987-6543",
  "email": "company@techcorp.com",
  "phone": "+1 (555) 987-6543",
  "selectedProgram": "Full-Stack Web Development",
  "startDate": "2026-03-01",
  "agreeTerms": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Enrollment successful! We will review your application shortly.",
  "data": {
    "inscriptionId": "clp111...",
    "studentId": "clp222...",
    "status": "Pending"
  }
}
```

**Errors:**
- `400` - Validation failed (missing fields, invalid email, etc.)
- `404` - Program not found
- `409` - Email already enrolled in this program

---

## Inscription (Admin) Endpoints

### GET /api/inscriptions

List all inscriptions with filters.

**Query Parameters:**
```
status: "Pending" | "Approved" | "Rejected" (optional)
type: "Individual" | "Company" (optional)
formation: Formation ID (optional)
```

**Example:**
```
GET /api/inscriptions?status=Pending&type=Individual
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clp123...",
      "type": "Individual",
      "requestorName": "John Doe",
      "requestorEmail": "john@example.com",
      "requestorPhone": "+1 (555) 123-4567",
      "startDate": "2026-03-01T00:00:00Z",
      "numberOfStudents": 1,
      "status": "Pending",
      "notes": null,
      "student": {
        "id": "clp456...",
        "email": "john@example.com",
        "type": "Individual"
      },
      "formation": {
        "id": "clp789...",
        "name": "Full-Stack Web Development"
      },
      "createdAt": "2026-02-17T10:00:00Z",
      "updatedAt": "2026-02-17T10:00:00Z"
    }
  ],
  "stats": {
    "total": 25,
    "pending": 10,
    "approved": 12,
    "rejected": 3
  }
}
```

### PATCH /api/inscriptions/[id]

Update inscription status (admin only).

**Path Parameters:**
```
id: Inscription ID
```

**Request:**
```json
{
  "status": "Approved",
  "notes": "Approved after review"
}
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inscription approved",
  "data": {
    "id": "clp123...",
    "status": "Approved",
    "notes": "Approved after review",
    "student": { ... },
    "formation": { ... },
    "updatedAt": "2026-02-17T14:00:00Z"
  }
}
```

**Errors:**
- `400` - Invalid status
- `401` - Unauthorized
- `404` - Inscription not found

---

## Student Endpoints

### GET /api/students

List all students with filters.

**Query Parameters:**
```
type: "Individual" | "Company" (optional)
status: "Active" | "Inactive" | "Graduated" (optional)
formation: Formation ID (optional)
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clp123...",
      "type": "Individual",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "dateOfBirth": "1995-05-15T00:00:00Z",
      "status": "Active",
      "enrolledDate": "2026-02-17T10:00:00Z",
      "formationId": "clp456...",
      "formation": {
        "id": "clp456...",
        "name": "Full-Stack Web Development"
      },
      "inscriptions": [
        {
          "id": "clp789...",
          "status": "Approved"
        }
      ],
      "createdAt": "2026-02-17T10:00:00Z",
      "updatedAt": "2026-02-17T10:00:00Z"
    }
  ]
}
```

---

## Partner Endpoints

### GET /api/partners

List partners (optionally featured only).

**Query Parameters:**
```
featured: "true" | "false" (optional)
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clp123...",
      "name": "Acme Corp",
      "website": "https://acme.example",
      "logoUrl": "https://...",
      "featured": true,
      "createdAt": "2026-01-01T10:00:00Z",
      "updatedAt": "2026-01-01T10:00:00Z"
    }
  ]
}
```

### POST /api/partners

Create new partner (admin only).

**Request:**
```json
{
  "name": "Tech Solutions Inc",
  "website": "https://techsolutions.example",
  "logoUrl": "https://example.com/logo.png",
  "featured": true
}
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Partner created",
  "data": {
    "id": "clp999...",
    "name": "Tech Solutions Inc",
    "website": "https://techsolutions.example",
    "logoUrl": "https://example.com/logo.png",
    "featured": true,
    "createdAt": "2026-02-17T12:00:00Z",
    "updatedAt": "2026-02-17T12:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing partner name
- `401` - Unauthorized
- `409` - Partner name already exists

---

## Contact Endpoints

### POST /api/contact

Submit contact form (public).

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Course Inquiry",
  "message": "I would like more information about your courses."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Message received! We will get back to you shortly.",
  "data": {
    "messageId": "clp123..."
  }
}
```

**Errors:**
- `400` - Missing or invalid fields
- `413` - Message too long

### GET /api/contact

List contact messages (admin only).

**Query Parameters:**
```
status: "Unread" | "Read" | "Replied" (optional)
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clp123...",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Course Inquiry",
      "message": "I would like more information...",
      "status": "Unread",
      "createdAt": "2026-02-17T10:00:00Z",
      "updatedAt": "2026-02-17T10:00:00Z"
    }
  ]
}
```

---

## File Upload Endpoints

### POST /api/upload/partner-logo

Generate signed URL for partner logo upload.

**Request:**
```json
{
  "fileName": "acme-logo.png",
  "fileSize": 2048576,
  "fileType": "image/png"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://project.supabase.co/storage/...",
    "bucketName": "partner-logos"
  }
}
```

**Steps:**
1. Get signed URL from this endpoint
2. Upload file directly to signed URL
3. Store returned URL in database

**Example Client Code:**
```typescript
// 1. Get signed URL
const { data } = await fetch('/api/upload/partner-logo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  }),
}).then(r => r.json())

// 2. Upload to signed URL
await fetch(data.uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
})

// 3. Save returned URL to database
await fetch('/api/partners', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Partner Name',
    logoUrl: data.uploadUrl,
  }),
})
```

**Errors:**
- `400` - Missing fields or invalid type
- `413` - File too large

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 413 | Payload Too Large - File too large |
| 500 | Server Error - Unexpected error |

---

## Rate Limiting

Current limits (implement before production):

```
- Login: 5 attempts per 15 minutes
- Enroll: 1 submission per IP per 24 hours
- API: 100 requests per 1 minute per user
```

---

## Pagination (Future Implementation)

When list endpoints become large:

```
GET /api/students?page=1&limit=50
GET /api/inscriptions?page=2&limit=25
GET /api/formations?skip=0&take=10

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234,
    "pages": 5
  }
}
```

---

**API Version:** 1.0
**Last Updated:** February 17, 2026
**Status:** Production Ready
