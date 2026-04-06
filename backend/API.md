# 📚 API Documentation

## Mini Course Management System

---

# 🔐 1. Authentication & Member

## 📝 Register

**POST** `/api/auth/register`
สมัครสมาชิกใหม่

**Request Body**

```json
{
  "username": "string",
  "password": "string"
}
```

---

## 🔑 Login

**POST** `/api/auth/login`
เข้าสู่ระบบ

**Request Body**

```json
{
  "username": "string",
  "password": "string"
}
```

---

## 👤 Get My Profile

**GET** `/api/auth/me`
ดูข้อมูลผู้ใช้งานปัจจุบัน

---

## ✏️ Update Member

**PUT** `/api/members/:id`
แก้ไขข้อมูลผู้ใช้งาน

---

## ❌ Delete Member

**DELETE** `/api/members/:id`
ลบผู้ใช้งานออกจากระบบ

---

# 📚 2. Course Management

## ➕ Create Course

**POST** `/api/courses`
สร้างคอร์สใหม่

**Request Body**

```json
{
  "title": "string",
  "description": "string"
}
```

---

## 📄 Get All Courses

**GET** `/api/courses`
ดึงรายการคอร์สทั้งหมด

---

## 🔍 Get Course Detail

**GET** `/api/courses/:id`
ดูรายละเอียดคอร์ส

---

## ✏️ Update Course

**PUT** `/api/courses/:id`
แก้ไขข้อมูลคอร์ส

---

## ❌ Delete Course

**DELETE** `/api/courses/:id`
ลบคอร์ส

---

## 👥 Get Course Students

**GET** `/api/courses/:id/students`
ดูรายชื่อผู้ลงทะเบียนในคอร์ส

---

# 📖 3. Lesson Management

## ➕ Create Lesson

**POST** `/api/courses/:course_id/lessons`
เพิ่มบทเรียนในคอร์ส

**Request Body**

```json
{
  "title": "string",
  "content": "string",
  "video_url": "string"
}
```

---

## 📄 Get Lessons by Course

**GET** `/api/courses/:course_id/lessons`
ดึงบทเรียนทั้งหมดในคอร์ส

---

## 🔍 Get Lesson Detail

**GET** `/api/lessons/:id`
ดูรายละเอียดบทเรียน

---

## ✏️ Update Lesson

**PUT** `/api/lessons/:id`
แก้ไขบทเรียน

---

## ❌ Delete Lesson

**DELETE** `/api/lessons/:id`
ลบบทเรียน

---

# 📝 4. Enrollment Management

## ➕ Enroll Course

**POST** `/api/enrollments`
ลงทะเบียนเรียน

**Request Body**

```json
{
  "course_id": 1
}
```

---

## 📄 Get My Courses

**GET** `/api/my-courses`
ดูคอร์สที่ผู้ใช้งานลงทะเบียน

---

## ❌ Cancel Enrollment

**DELETE** `/api/enrollments/:id`
ยกเลิกการลงทะเบียน

---

# 📊 5. Progress Management

## ✅ Mark Lesson Completed

**POST** `/api/progress`
ทำเครื่องหมายว่าเรียนจบบทเรียน

**Request Body**

```json
{
  "lesson_id": 1,
  "is_completed": true
}
```

---

## 📄 Get Course Progress

**GET** `/api/courses/:course_id/progress`
ดูความคืบหน้าของผู้ใช้งานในคอร์สนั้น

---

## 📄 Get My Progress

**GET** `/api/my-progress`
ดูความคืบหน้าการเรียนทั้งหมดของผู้ใช้งาน

---

# 📈 6. Admin Dashboard (Optional)

## 📊 Get Dashboard Summary

**GET** `/api/admin/dashboard`

**Response Example**

```json
{
  "total_members": 100,
  "total_courses": 20,
  "total_enrollments": 250,
  "popular_course": "Course Name"
}
```

---

# 📌 Summary

| Module        | จำนวน API   |
| ------------- | ----------- |
| Auth & Member | 5           |
| Course        | 6           |
| Lesson        | 5           |
| Enrollment    | 3           |
| Progress      | 3           |
| Dashboard     | 1           |
| **Total**     | **23 APIs** |

---

📌 เอกสารนี้สามารถใช้เป็นแนวทางในการพัฒนา Backend และใช้สำหรับส่งอาจารย์หรือแนบในเอกสารโปรเจคได้ทันที
