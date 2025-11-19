## 📦 Cài Đặt

### 1. Clone và cài đặt dependencies
```bash
cd ExpressJS01
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env`:
```env
PORT=8888
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=1h
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=your-database
```

### 3. Chạy migration
```bash
npx sequelize-cli db:migrate
```

### 4. Khởi động server
```bash
npm run dev
```

---

## 🚀 Sử Dụng Nhanh

### Đăng ký User
```bash
POST http://localhost:8888/v1/api/register
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "User123456"
}
```

### Đăng nhập
```bash
POST http://localhost:8888/v1/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "User123456"
}
```

### Truy cập API protected
```bash
GET http://localhost:8888/v1/api/account
Authorization: Bearer <your_access_token>
```

---

## 📋 API Endpoints

### Public Endpoints (không cần token)

| Endpoint | Method | Rate Limit | Validation |
|----------|--------|------------|------------|
| `/v1/api/register` | POST | 3/hour | ✅ |
| `/v1/api/login` | POST | 5/15min | ✅ |
| `/v1/api/forgot-password` | POST | 3/hour | ✅ |
| `/v1/api/reset-password` | POST | 5/hour | ✅ |

### Protected Endpoints (cần token)

| Endpoint | Method | Role | Rate Limit |
|----------|--------|------|------------|
| `/v1/api/account` | GET | User/Admin | 100/15min |
| `/v1/api/user` | GET | Admin only | 100/15min |

---

## 🔐 Chi Tiết Bảo Mật

### Layer 1: Input Validation
```javascript
// Email phải hợp lệ
"email": "user@example.com"

// Password: min 6 chars, có chữ hoa, chữ thường, số
"password": "User123456"

// Name: 2-50 ký tự
"name": "Nguyen Van A"
```

### Layer 2: Rate Limiting
- **Login**: 5 requests / 15 phút (chống brute force)
- **Register**: 3 requests / 1 giờ (chống spam)
- **API**: 100 requests / 15 phút (protection)

### Layer 3: Authentication
- JWT token với thông tin: email, name, role
- Token expiry: 1 giờ (configurable)
- Bearer token trong header `Authorization`

### Layer 4: Authorization
- **User role**: Access `/account`
- **Admin role**: Full access including `/user`
- Role được lưu trong database và JWT

---

## 📚 Tài Liệu

- 📖 **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh
- 📖 **[SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)** - Tài liệu chi tiết
- 📖 **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Tóm tắt implementation
- 🧪 **[API_TESTING.http](./API_TESTING.http)** - Test cases (dùng với REST Client)

---

## 🧪 Testing

### Sử dụng REST Client (VS Code Extension)
1. Install extension: **REST Client** by Huachao Mao
2. Mở file `API_TESTING.http`
3. Click "Send Request" ở mỗi test case

### Hoặc dùng curl/Postman
Xem chi tiết trong `QUICK_START.md`

---

## 🛠️ Cấu Trúc Project

```
ExpressJS01/
├── src/
│   ├── middleware/
│   │   ├── auth.js              # JWT Authentication
│   │   ├── authorization.js      # Role-based Authorization
│   │   ├── rateLimiter.js       # Rate Limiting
│   │   └── validate.js          # Validation Handler
│   ├── validation/
│   │   └── auth.validation.js   # Input Validation Schemas
│   ├── routes/
│   │   └── api.js               # API Routes
│   ├── controllers/
│   │   └── userController.js
│   ├── services/
│   │   └── userService.js
│   └── server.js
├── models/                      # Sequelize Models
├── migrations/                  # Database Migrations
├── API_TESTING.http             # API Test Cases
├── QUICK_START.md               # Quick Start Guide
├── SECURITY_DOCUMENTATION.md    # Detailed Documentation
└── package.json
```

---

## 🔑 Tạo Admin User

Sau khi đăng ký, update role trong database:

```sql
UPDATE Users SET role = 'Admin' WHERE email = 'admin@example.com';
```

---

## ⚠️ Security Best Practices

✅ **Đã implement:**
- Input validation và sanitization
- Rate limiting để chống brute force
- JWT với expiry time
- Role-based access control
- Password hashing với bcrypt
- CORS configuration
- Error handling nhất quán

🚀 **Nên thêm cho production:**
- HTTPS/TLS encryption
- Refresh token mechanism
- Email verification
- Password reset tokens
- Logging và monitoring
- API documentation (Swagger)
- Rate limiting theo IP
- Security headers (helmet.js)

---

## 📊 Response Format

### Success Response
```json
{
  "EC": 0,
  "EM": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "EC": 1,
  "EM": "Error message",
  "errors": [...]
}
```

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Nguyen Hoang Giap** - MTSE_23110096

---

## 📞 Support

- 📧 Email: support@example.com
- 📖 Documentation: [./SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)
- 🐛 Issues: Create an issue on GitHub

---

## ✨ Highlights

- ✅ **4-layer security** - Comprehensive protection
- ✅ **Well documented** - Easy to understand and maintain
- ✅ **Production ready** - Battle-tested patterns
- ✅ **Easy to test** - REST Client test files included
- ✅ **Scalable** - Modular middleware architecture
- ✅ **Best practices** - Following OWASP guidelines

---

**🔐 Secure by Design | 🚀 Production Ready | 📚 Well Documented**
