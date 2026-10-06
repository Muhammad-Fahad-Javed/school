# School Management Portal

A complete, role-based School Management System built with Next.js 14 (App Router),
Prisma, PostgreSQL, and Tailwind CSS.

## Features

- Role-based authentication (Admin, Teacher, Student, Parent)
- Student, teacher, and parent management
- Attendance tracking with reports
- Examination and results management with automatic grading
- Fee management with voucher generation and payment tracking
- Transcript generation with public QR/link verification
- Assignments, announcements, and timetable support
- Dashboard analytics (attendance trends, fee collection, performance distribution)
- Global search across students, teachers, and vouchers
- Audit logging and school settings management

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT sessions (jose) stored in an HTTP-only cookie, bcrypt password hashing
- **UI:** Tailwind CSS, lucide-react icons, Recharts for charts
- **Language:** TypeScript throughout

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/school-management-portal.git
   cd school-management-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   ```bash
   createdb school_db
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials and a strong JWT_SECRET
   ```

5. **Run database migrations**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. **Seed the database**

   ```bash
   npm run db:seed
   ```

7. **Start the development server**

   ```bash
   npm run dev
   ```

8. **Access the application**

   - Admin: http://localhost:3000/admin
   - Teacher: http://localhost:3000/teacher
   - Student: http://localhost:3000/student
   - Parent: http://localhost:3000/parent

## Demo Credentials

The seed script creates an admin account:

- **Admin:** admin@school.com / admin123

Create Teacher, Student, and Parent accounts via `/register`, or add them directly
through Prisma Studio (`npm run db:studio`).

## Project Structure

```
school-management-portal/
├── prisma/              # Database schema and seed script
├── src/
│   ├── app/             # Next.js App Router pages and API routes
│   │   ├── (auth)/      # Login, register, password reset
│   │   ├── (dashboard)/ # Role-based dashboards (admin/teacher/student/parent)
│   │   ├── verify/      # Public transcript verification
│   │   └── api/         # REST API route handlers
│   ├── components/      # UI, layout, and role-specific components
│   ├── lib/              # Auth, Prisma client, and utility helpers
│   ├── hooks/            # Client-side React hooks
│   └── types/            # Shared TypeScript types
└── public/               # Static assets
```

## Notes

- Several dashboard sub-pages (e.g. individual admin sections for classes,
  subjects, vouchers, timetable, etc.) are scaffolded with working auth guards
  and layout, ready for you to wire up the specific tables/forms for each
  resource using the existing API routes and Prisma models as a starting point.
- The forgot-password flow logs the reset link to the server console — wire up
  an email provider (e.g. Resend, SendGrid) before using this in production.
- File uploads (profile photos, documents, assignment attachments) are modeled
  in the schema as URLs; connect an S3-compatible bucket (env vars are already
  scaffolded in `.env.example`) to handle actual uploads.
