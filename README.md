# Notes API - Backend Developer Test

## 📋 Deskripsi Proyek

Notes API adalah aplikasi REST API untuk manajemen catatan (notes) dengan sistem autentikasi JWT. Proyek ini dikembangkan sebagai bagian dari tes skill Backend Developer untuk Gencidev.

## 🚀 Fitur Utama

### Autentikasi & Autorisasi
- ✅ Registrasi pengguna dengan validasi email unik
- ✅ Login dengan JWT token
- ✅ Middleware autentikasi untuk endpoint yang dilindungi
- ✅ Password hashing menggunakan bcryptjs

### Manajemen Notes
- ✅ Create - Membuat catatan baru
- ✅ Read - Melihat semua catatan pengguna dengan pagination
- ✅ Read - Melihat detail catatan berdasarkan ID
- ✅ Update - Mengubah catatan yang sudah ada
- ✅ Delete - Menghapus catatan
- ✅ Autorisasi - Pengguna hanya dapat mengakses catatan miliknya

### Validasi & Error Handling
- ✅ Validasi input menggunakan Joi
- ✅ Error handling yang komprehensif
- ✅ Response format yang konsisten
- ✅ Logging error untuk debugging

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Password Hashing**: bcryptjs
- **Testing**: Jest + Supertest
- **Environment**: dotenv

## 📁 Struktur Proyek

```
test-be-Gencidev/
├── src/
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   └── notesController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   └── notes.js
│   ├── services/        # Business logic
│   │   ├── authService.js
│   │   └── notesService.js
│   ├── utils/           # Utilities
│   │   ├── jwt.js
│   │   └── validation.js
│   ├── config/          # Configuration
│   │   └── database.js
│   └── app.js           # Express app setup
├── prisma/              # Database schema
│   └── schema.prisma
├── tests/               # Test files
│   ├── auth.test.js
│   └── notes.test.js
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json         # Dependencies
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- MySQL Server
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/ivanyoga01/test-be-Gencidev.git
cd test-be-Gencidev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Buat file `.env` berdasarkan `.env.example`:
```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=notes_api
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### 4. Database Setup
```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Alternative: Push schema to database
npm run db:push
```

### 5. Start Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🧪 Testing

### Menjalankan Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Total Tests**: 23
- **Passing**: 23/23 ✅
- **Coverage**: Authentication, CRUD Operations, Validation, Authorization

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Notes Endpoints

> **Note**: Semua endpoint notes memerlukan Authorization header dengan Bearer token

#### Create Note
```http
POST /api/notes
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My Note Title",
  "content": "Note content here"
}
```

#### Get All Notes (with Pagination)
```http
GET /api/notes?page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Get Note by ID
```http
GET /api/notes/:id
Authorization: Bearer <jwt_token>
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <jwt_token>
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs untuk hashing password
- **Input Validation**: Joi validation untuk semua input
- **Authorization**: User hanya dapat mengakses data miliknya
- **Error Handling**: Tidak mengekspos informasi sensitif
- **Environment Variables**: Konfigurasi sensitif disimpan di .env

## 🚀 Deployment

### Environment Variables untuk Production
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_super_secure_jwt_secret
```

### Build Commands
```bash
# Install production dependencies
npm ci --only=production

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Start application
npm start
```

## 📝 Development Notes

### Database Schema
- **Users Table**: id, name, email, password, createdAt, updatedAt
- **Notes Table**: id, title, content, userId, createdAt, updatedAt
- **Relationship**: One-to-Many (User -> Notes)

### Key Design Decisions
1. **Layered Architecture**: Controllers -> Services -> Database
2. **Middleware Pattern**: Authentication, Validation, Error Handling
3. **JWT Stateless Authentication**: Scalable dan secure
4. **Prisma ORM**: Type-safe database operations
5. **Comprehensive Testing**: Unit dan integration tests

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Pastikan MySQL server berjalan
   - Periksa konfigurasi database di .env
   - Jalankan `npm run db:push` untuk sync schema

2. **JWT Token Error**
   - Pastikan JWT_SECRET sudah diset di .env
   - Periksa format Authorization header: `Bearer <token>`

3. **Test Failures**
   - Pastikan database test terpisah atau gunakan in-memory database
   - Jalankan `npm test` untuk melihat detail error

## 👨‍💻 Developer

**Muhammad Ivan Prayoga - Kandidat Backend Developer - Gencidev Test**

---

## 📄 License

ISC License - Proyek ini dibuat untuk keperluan tes skill backend developer.