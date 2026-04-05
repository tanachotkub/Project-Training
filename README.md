# 📚 Mini Course Management System
> ระบบจัดการคอร์สเรียนออนไลน์ — ASP.NET Core · MySQL · JWT

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | ASP.NET Core (.NET 10) |
| ORM | Entity Framework Core 9 |
| Database | MySQL |
| Authentication | JWT Bearer Token |
| Password | BCrypt Hash |
| Logging | Serilog |
| API Docs | Swagger UI (Dark Theme) |
| Pattern | Service Layer Architecture |

---

## 📁 โครงสร้าง Project

```
backend/
├── Controllers/
│   ├── MemberController.cs
│   ├── CourseController.cs
│   ├── LessonController.cs
│   ├── EnrollmentController.cs
│   └── ProgressController.cs
│
├── Services/
│   ├── IMemberService.cs / MemberService.cs
│   ├── ITokenService.cs  / TokenService.cs
│   ├── ICourseService.cs / CourseService.cs
│   ├── ILessonService.cs / LessonService.cs
│   ├── IEnrollmentService.cs / EnrollmentService.cs
│   └── IProgressService.cs   / ProgressService.cs
│
├── Models/
│   ├── Entities/
│   │   ├── Member.cs
│   │   ├── Course.cs
│   │   ├── Lesson.cs
│   │   ├── Enrollment.cs
│   │   └── Progress.cs
│   └── DTOs/
│       ├── Member/
│       │   ├── MemberDto.cs
│       │   ├── RegisterDto.cs
│       │   ├── LoginDto.cs
│       │   ├── LoginResponseDto.cs
│       │   └── UpdateMemberDto.cs
│       ├── Course/
│       │   ├── CreateCourseDto.cs
│       │   ├── UpdateCourseDto.cs
│       │   ├── CourseDto.cs
│       │   └── CourseDetailDto.cs
│       ├── Lesson/
│       │   ├── CreateLessonDto.cs
│       │   ├── UpdateLessonDto.cs
│       │   └── LessonDto.cs
│       ├── Enrollment/
│       │   ├── EnrollCourseDto.cs
│       │   ├── EnrollmentDto.cs
│       │   └── MyCourseDto.cs
│       └── Progress/
│           ├── MarkProgressDto.cs
│           ├── ProgressDto.cs
│           └── CourseProgressDto.cs
│
├── Middlewares/
│   └── ExceptionMiddleware.cs
├── wwwroot/
│   └── swagger-dark.css
├── AppDbContext.cs
├── appsettings.json
└── Program.cs
```

---

## 🗄️ โครงสร้างฐานข้อมูล

### ความสัมพันธ์ระหว่างตาราง

```
member ──────────── course          (1:N) member สร้างได้หลาย course
  │                    │
  │                    └─── lesson  (1:N) course มีหลาย lesson
  │
  ├── enrollment ──── course        (N:M) member ลงทะเบียนได้หลาย course
  │
  └── progress ────── lesson        (N:M) member ติดตาม progress หลาย lesson
```

### Tables

**`member`**
| Column | Type | Description |
|---|---|---|
| id | INT PK | รหัสสมาชิก |
| username | VARCHAR(50) | ชื่อผู้ใช้ |
| password | VARCHAR(255) | รหัสผ่าน (BCrypt Hash) |

**`course`**
| Column | Type | Description |
|---|---|---|
| id | INT PK | รหัสคอร์ส |
| title | VARCHAR(255) | ชื่อคอร์ส |
| description | TEXT | รายละเอียด |
| created_by | INT FK | อ้างอิง member |

**`lesson`**
| Column | Type | Description |
|---|---|---|
| id | INT PK | รหัสบทเรียน |
| course_id | INT FK | อ้างอิง course |
| title | VARCHAR(255) | ชื่อบทเรียน |
| content | TEXT | เนื้อหา |
| video_url | VARCHAR(255) | ลิงก์วิดีโอ |

**`enrollment`**
| Column | Type | Description |
|---|---|---|
| id | INT PK | รหัสการลงทะเบียน |
| member_id | INT FK | อ้างอิง member |
| course_id | INT FK | อ้างอิง course |
| enrolled_at | DATETIME | วันที่ลงทะเบียน |

**`progress`**
| Column | Type | Description |
|---|---|---|
| id | INT PK | รหัส progress |
| member_id | INT FK | อ้างอิง member |
| lesson_id | INT FK | อ้างอิง lesson |
| is_completed | BOOLEAN | เรียนจบแล้วหรือยัง |
| completed_at | DATETIME | วันที่เรียนจบ |

---

## 🔗 API ทั้งหมด

### 👤 Member

| Method | Endpoint | Auth | หน้าที่ |
|---|---|---|---|
| GET | `/api/member` | Token | ดูสมาชิกทั้งหมด |
| POST | `/api/member/register` | ❌ | สมัครสมาชิก |
| POST | `/api/member/login` | ❌ | เข้าสู่ระบบ + รับ Token |
| PUT | `/api/member/{id}` | ❌ | แก้ไขข้อมูล |
| DELETE | `/api/member/{id}` | ❌ | ลบสมาชิก |

### 📚 Course

| Method | Endpoint | Auth | หน้าที่ |
|---|---|---|---|
| GET | `/api/courses` | ❌ | ดู course ทั้งหมด |
| GET | `/api/courses/{id}` | ❌ | ดู course + lessons |
| POST | `/api/courses` | Token | สร้าง course |
| PUT | `/api/courses/{id}` | Token | แก้ไข course |
| DELETE | `/api/courses/{id}` | Token | ลบ course |
| GET | `/api/courses/{id}/students` | Token | ดูผู้ลงทะเบียน |

### 📖 Lesson

| Method | Endpoint | Auth | หน้าที่ |
|---|---|---|---|
| GET | `/api/courses/{courseId}/lessons` | ❌ | ดู lessons ทั้งหมดในคอร์ส |
| GET | `/api/lessons/{id}` | ❌ | ดู lesson เดียว |
| POST | `/api/courses/{courseId}/lessons` | Token | สร้าง lesson |
| PUT | `/api/lessons/{id}` | Token | แก้ไข lesson |
| DELETE | `/api/lessons/{id}` | Token | ลบ lesson |

### 📝 Enrollment

| Method | Endpoint | Auth | หน้าที่ |
|---|---|---|---|
| POST | `/api/enrollments` | Token | ลงทะเบียน course |
| GET | `/api/my-courses` | Token | ดู course ที่ลงทะเบียน |
| DELETE | `/api/enrollments/{id}` | Token | ยกเลิกการลงทะเบียน |

### 📊 Progress

| Method | Endpoint | Auth | หน้าที่ |
|---|---|---|---|
| POST | `/api/progress` | Token | mark lesson จบ/ไม่จบ |
| GET | `/api/courses/{courseId}/progress` | Token | ดู progress ใน course |
| GET | `/api/my-progress` | Token | ดู progress ทุก course |

---

## 🔐 ระบบ Authentication

ใช้ **JWT Bearer Token** — หลัง login สำเร็จจะได้ token กลับมา

```
POST /api/member/login
→ ได้ token กลับมา

ใช้ token ใน Header:
Authorization: Bearer eyJhbGci...
```

### Token Payload
```json
{
  "nameid": "1",
  "name": "john",
  "exp": 1775397466,
  "iss": "backend",
  "aud": "frontend"
}
```

### Config ใน `appsettings.json`
```json
{
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "Issuer": "backend",
    "Audience": "frontend",
    "ExpireHours": 24
  }
}
```

---

## 🔄 การไหลของ Request

```
HTTP Request
    ↓
Middleware          — จับ Exception ทุก request
    ↓
Controller          — รับ request, ดึง memberId จาก JWT
    ↓
Service             — Business logic, validate ข้อมูล
    ↓
AppDbContext        — query MySQL ผ่าน EF Core
    ↓
MySQL Database
```

---

## 🧪 ลำดับการทดสอบ

```
1. POST  /api/member/register          → สมัครสมาชิก
2. POST  /api/member/login             → รับ JWT Token
                                         ใส่ Token ใน Authorize
3. POST  /api/courses                  → สร้าง course
4. POST  /api/courses/1/lessons        → เพิ่ม lesson
5. POST  /api/courses/1/lessons        → เพิ่ม lesson อีกบท
6. POST  /api/enrollments              → ลงทะเบียน course
7. GET   /api/my-courses               → ดู course ที่ลงทะเบียน
8. POST  /api/progress                 → mark lesson จบ
9. GET   /api/courses/1/progress       → ดู progress ใน course
10. GET  /api/my-progress              → ดู progress ทุก course
```

---

## 📦 NuGet Packages

| Package | Version | หน้าที่ |
|---|---|---|
| `Pomelo.EntityFrameworkCore.MySql` | 9.0.0 | เชื่อม MySQL |
| `Microsoft.EntityFrameworkCore.Tools` | 9.0.0 | Migration |
| `Microsoft.EntityFrameworkCore.Relational` | 9.0.0 | EF Core base |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 10.0.5 | JWT Auth |
| `System.IdentityModel.Tokens.Jwt` | 8.17.0 | สร้าง JWT |
| `BCrypt.Net-Next` | 4.1.0 | Hash password |
| `Serilog.AspNetCore` | 10.0.0 | Logging |
| `Swashbuckle.AspNetCore` | 6.9.0 | Swagger UI |

---

## ✅ Business Rules สำคัญ

| Rule | รายละเอียด |
|---|---|
| Password | เก็บเป็น BCrypt Hash เสมอ — ไม่เก็บ plain text |
| Login error | แสดงแค่ "Username or password is incorrect" — ไม่บอกว่าผิดตรงไหน |
| Create course | ดึง memberId จาก JWT Token — ไม่ต้องส่งมาใน request |
| Enrollment | เช็ค duplicate — ลงทะเบียน course เดิมซ้ำไม่ได้ |
| Cancel enrollment | เฉพาะเจ้าของเท่านั้นที่ยกเลิกได้ |
| Mark progress | ต้องลงทะเบียน course ก่อน — mark progress ได้ |
| Progress percent | คำนวณ = completedLessons / totalLessons × 100 |
| DTO | ไม่ส่ง Password ออกไปให้ client เด็ดขาด |

---

## 🚀 วิธีรัน Project

```bash
# 1. clone หรือเข้าไปใน folder
cd backend

# 2. ตั้งค่า connection string ใน appsettings.json
# "Default": "Server=localhost;Port=3306;Database=myapp_db;User=root;Password=..."

# 3. restore packages
dotnet restore

# 4. รัน
dotnet run

# 5. เปิด Swagger
# http://localhost:5000/swagger
```