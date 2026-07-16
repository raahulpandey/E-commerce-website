# ShopVault — Full-Stack E-commerce Platform

A production-ready, scalable full-stack e-commerce application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 🚀 Live Demo

| Layer | URL |
|---|---|
| Frontend | Deploy to Vercel |
| Backend | Deploy to Render/Railway |

---

## ✨ Features

### Frontend
- ⚡ Next.js 15 App Router with TypeScript
- 🎨 Tailwind CSS with dark mode support
- 🛍️ Full shopping experience — Browse, Cart, Checkout, Orders
- ❤️ Wishlist with instant toggle
- 🔍 Search with debounce
- 🧾 Category browsing with animated tiles
- 📦 Order tracking with visual progress stepper
- 👤 User profile with addresses & password management
- 🌙 Dark mode via next-themes
- 📊 Admin Dashboard with revenue charts (Recharts)
- 🔐 JWT authentication with Zustand store

### Backend
- 🏗️ Clean MVC architecture with service layer
- 🔐 JWT Access + Refresh Token auth
- 🔒 bcrypt password hashing (12 rounds)
- 🛡️ Helmet, CORS, Rate Limiting security
- 📦 Multer + Cloudinary image uploads
- 📧 Nodemailer password reset emails
- 📊 MongoDB aggregation analytics
- 💰 Coupon system (% and fixed discounts)
- ✅ 30+ REST APIs with consistent JSON responses
- 🗜️ Compression middleware
- 📝 Global error handler & custom ApiError class

---

## 🗂️ Project Structure

```
ecommerce-fullstack/
├── backend/                  # Node.js + Express.js API
│   ├── config/               # DB connection, constants
│   ├── controllers/          # Route handlers (thin layer)
│   ├── middleware/           # Auth, error, rate-limit, upload
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── services/             # Business logic (fat layer)
│   ├── utils/                # ApiError, ApiResponse, cloudinary
│   ├── validators/           # express-validator rules
│   ├── app.js                # Express app configuration
│   └── server.js             # Entry point + graceful shutdown
│
└── frontend/                 # Next.js 15 App
    └── src/
        ├── app/              # App Router pages
        │   ├── (auth)/       # login, register, forgot/reset password
        │   ├── shop/         # Product listing with filters
        │   ├── products/[id] # Product detail + reviews
        │   ├── cart/         # Shopping cart
        │   ├── checkout/     # Checkout with coupon
        │   ├── order-success/
        │   ├── orders/       # Order history + detail
        │   ├── wishlist/
        │   ├── profile/      # User profile + addresses
        │   ├── categories/
        │   ├── search/
        │   └── admin/        # Dashboard, Products, Orders, Users
        ├── components/       # Reusable UI components
        ├── hooks/            # Custom React hooks
        ├── lib/              # Axios instance, QueryClient
        ├── services/         # API service modules
        ├── store/            # Zustand global state
        ├── types/            # TypeScript type definitions
        └── utils/            # Formatters, helpers
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 20+ (LTS)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/raahulpandey/E-commerce-website.git
cd E-commerce-website
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy and configure .env
cp .env.example .env
# → Edit .env with your MongoDB URI, JWT secrets, Cloudinary keys

npm run dev       # Development (nodemon)
npm start         # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy and configure .env.local
cp .env.example .env.local
# → Edit NEXT_PUBLIC_API_URL to point to your backend

npm run dev       # Development on http://localhost:3000
npm run build     # Production build
npm start         # Serve production build
```

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `JWT_ACCESS_EXPIRY` | Token expiry (e.g., `15m`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` | SMTP host (e.g., `smtp.gmail.com`) |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | Gmail app password |
| `CORS_ORIGIN` | Frontend URL (e.g., `http://localhost:3000`) |
| `FRONTEND_URL` | Frontend URL for password reset links |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## 📡 API Reference

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login & get tokens |
| POST | `/logout` | Logout & clear cookie |
| GET | `/profile` | Get current user |
| PUT | `/profile` | Update profile |
| PUT | `/change-password` | Change password |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password` | Reset with token |
| POST | `/refresh-token` | Refresh access token |

### Products (`/api/v1/products`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List with filter/sort/pagination |
| GET | `/:id` | Product detail |
| GET | `/categories` | Distinct categories list |
| POST | `/` | Create product (admin) |
| PUT | `/:id` | Update product (admin) |
| DELETE | `/:id` | Soft delete product (admin) |

### Categories (`/api/v1/categories`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | All active categories |
| GET | `/:slug` | Category by slug |
| POST | `/` | Create category (admin) |
| PUT | `/:id` | Update category (admin) |
| DELETE | `/:id` | Delete category (admin) |

### Cart (`/api/v1/cart`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get user's cart |
| POST | `/` | Add item |
| PATCH | `/:productId` | Update quantity |
| DELETE | `/:productId` | Remove item |
| DELETE | `/` | Clear cart |

### Wishlist (`/api/v1/wishlist`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get wishlist |
| POST | `/` | Add to wishlist |
| DELETE | `/:productId` | Remove from wishlist |
| DELETE | `/` | Clear wishlist |

### Orders (`/api/v1/orders`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Place order |
| GET | `/` | User's orders |
| GET | `/:id` | Order detail |
| PATCH | `/:id/cancel` | Cancel order |
| GET | `/admin/all` | All orders (admin) |
| PATCH | `/admin/:id/status` | Update status (admin) |
| GET | `/admin/stats` | Order stats (admin) |

### Reviews (`/api/v1/products/:productId/reviews`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Product reviews |
| POST | `/` | Add review |
| PUT | `/:id` | Update review |
| DELETE | `/:id` | Delete review |

### Coupons (`/api/v1/coupons`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/validate` | Validate coupon |
| GET | `/` | All coupons (admin) |
| POST | `/` | Create coupon (admin) |
| PUT | `/:id` | Update coupon (admin) |
| DELETE | `/:id` | Delete coupon (admin) |

### Addresses, Dashboard, Upload — see full Postman collection

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
vercel deploy --prod
```
Set `NEXT_PUBLIC_API_URL` in Vercel environment variables.

### Backend → Render
1. Create a new Web Service on Render
2. Set Build Command: `npm install`
3. Set Start Command: `node server.js`
4. Add all environment variables from `.env.example`

---

## 📮 Postman Collection

Import `backend/postman_collection.json` to test all APIs:
1. Open Postman → Import → select `postman_collection.json`
2. Set environment variable `BASE_URL` to `http://localhost:5000`
3. Run **Register** → **Login** (auto-saves token) → test any endpoint

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Toasts | Sonner |
| Backend Runtime | Node.js (LTS) |
| Backend Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (HttpOnly cookies) |
| Password Hashing | bcrypt (12 rounds) |
| Image Uploads | Multer + Cloudinary |
| Email | Nodemailer |
| Security | Helmet, CORS, Rate Limit |

---

## 📄 License

MIT © Rahul Pandey
