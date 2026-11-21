
# 💈 SalonBook

### ✨ Your Beauty, Your Time, Your Appointment.

<p align="center">
  A modern salon appointment booking platform designed to make discovering salon services and scheduling appointments simple, seamless, and convenient.
</p>

<p align="center">
  <a href="https://salonbook-lemon.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_Website-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/poranmia2222/salonbook-client">
    <img src="https://img.shields.io/badge/Client-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="Client Repository" />
  </a>
  <a href="https://github.com/poranmia2222/salonbook-server">
    <img src="https://img.shields.io/badge/Server-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="Server Repository" />
  </a>
</p>

---

## 📖 Introduction

**SalonBook** is a modern salon appointment booking platform that provides a seamless experience for customers and salon administrators.

Customers can explore salon services, view pricing and service duration, select their preferred appointment date and time, and book appointments online.

The platform also includes an admin dashboard for managing services, users, and appointments, with secure online payment integration through Stripe.

## ✨ Features

### 👤 Customer Features

- 🔍 Explore and browse available salon services.
- 📋 View detailed service information, pricing, and duration.
- 📅 Book appointments with date and time selection.
- 🚫 Appointment availability validation to prevent double bookings.
- 🔐 Secure authentication and session management.
- 📖 View personal appointment history and details.
- 💳 Secure online payments through Stripe Checkout.
- 🔔 Interactive notifications and form validation.

### 🛡️ Admin Features

- 📊 Admin dashboard for managing salon operations.
- 💇 Create, update, and delete salon services.
- 👥 View registered users.
- 📅 Manage customer appointments.
- 🔄 Update appointment statuses.

### 🎨 UI & Experience

- 📱 Fully responsive design.
- 🧩 Reusable and accessible UI components.
- ⚡ Optimized Next.js application.
- 🎯 Clean and user-friendly interface.
- ✅ Form validation and error handling.

## 🛠️ Tech Stack

### Frontend

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

### UI & Authentication

<p>
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Better_Auth-000000?style=for-the-badge&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

### Backend & Payment

<p>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
</p>

### Deployment

<p>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

## 🚀 Getting Started

Follow these steps to run the project locally.

### 📋 Prerequisites

- Node.js
- npm
- SalonBook backend API
- MongoDB and Better Auth configuration
- Stripe account

### 1. Clone the Repository

```bash
git clone https://github.com/poranmia2222/salonbook-client.git
cd salonbook-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

```bash
npm run build
npm run start
```

## 🔌 API Reference

SalonBook Client communicates with a separate Express.js backend API.

| Property | Details |
|---|---|
| 🌐 Live API | https://salonbook-server-psi.vercel.app/ |
| 💻 Local API | `http://localhost:5000` |
| ⚙️ Server | [GitHub Repository](https://github.com/poranmia2222/salonbook-server) |

### 💇 Service Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/services` | Retrieve all services |
| `GET` | `/services/:id` | Get service details |
| `POST` | `/services` | Create a service |
| `PATCH` | `/services/:id` | Update a service |
| `DELETE` | `/services/:id` | Delete a service |

### 📅 Appointment Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/appointments` | Retrieve appointments |
| `POST` | `/appointment` | Create an appointment |
| `PATCH` | `/appointment/:id` | Update appointment status |
| `DELETE` | `/appointment/:id` | Delete an appointment |

### 💳 Payment Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `PATCH` | `/payments/checkout-verify` | Verify Stripe payment |

## 🔄 Application Workflow

1. 🔍 Explore available salon services.
2. 🔐 Sign in or create an account.
3. 📅 Select a service, date, and time.
4. 🚫 Backend validates appointment availability.
5. 💳 Complete payment through Stripe Checkout.
6. ✅ Backend verifies the payment session.
7. 📖 View updated appointment and payment information.

---

## 🌐 Live Project

<p align="center">
  <a href="https://salonbook-lemon.vercel.app/">
    <img src="https://img.shields.io/badge/Explore_SalonBook-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
</p>

<p align="center">
  <strong>💈 SalonBook — Making salon appointments easier, faster, and smarter.</strong>
</p>
