# BloodOS Client 🩸

<div align="center">

**A modern blood donation coordination platform for Bangladesh**

[Live Demo](https://bloodos.vercel.app) • [Server Repo](https://github.com/imarufbillah/bloodos-server) • [Report Bug](https://github.com/imarufbillah/bloodos-client/issues)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Project Overview

BloodOS Client is the frontend application of a comprehensive blood donation coordination platform designed specifically for Bangladesh. Built with Next.js 16 and React 19, it provides an intuitive, responsive interface for connecting blood donors with patients in need. The platform features real-time blood request management, donor discovery, intelligent filtering, and a seamless authentication experience.

The application follows modern web development practices with server-side rendering, type-safe code, and a mobile-first responsive design using shadcn/ui v4 components with Tailwind CSS v4.

---

## 🚀 Key Features

### 🔐 **Authentication & Authorization**

- Email/password authentication with Better Auth
- Session-based authentication with secure cookies
- Protected routes with middleware-based access control
- Role-based permissions (User, Admin)
- Profile completion onboarding flow

### 🩸 **Blood Request Management**

- Create urgent blood requests with comprehensive details
- Browse active requests with advanced filtering
- Real-time status updates (Pending, Fulfilled, Cancelled, Expired)
- Manage your own requests (edit, cancel, mark as fulfilled)
- Urgency levels with visual badges (Critical, Urgent, Moderate)
- Request expiration based on needed-by date

### 👥 **Donor Discovery**

- Browse verified blood donors by blood group and location
- Filter donors by district and blood group
- View donor availability status
- Eligibility tracking based on last donation date
- Phone number privacy masking (01XXX\*\*\*XXX format)

### 🎨 **Modern UI/UX**

- shadcn/ui v4 components (base-nova theme)
- Dark mode support with system preference detection
- Responsive design (mobile, tablet, desktop)
- Loading skeletons for better perceived performance
- Error boundaries with fallback UI
- Toast notifications for user feedback

### 🔍 **Advanced Filtering & Search**

- Multi-select filters for blood groups and districts
- Urgency level filtering
- Keyword search functionality
- Clear all filters with one click
- Real-time filter updates

### 👤 **User Profile Management**

- Complete profile with avatar upload (via IMGBB)
- Update personal information (name, phone, district, blood group)
- Donor status toggle
- Last donation date tracking
- Profile completion progress

### 🛡️ **Admin Dashboard**

- User management (view, suspend, promote)
- Request statistics and analytics
- Platform moderation tools
- Ban/unban user functionality

---

## 🛠️ Technologies Used

### **Core Framework**

- **[Next.js 16.2.10](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.4](https://reactjs.org/)** - UI library
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - Type safety

### **Styling & UI**

- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui v4](https://ui.shadcn.com/)** - Re-usable component library (base-nova)
- **[@base-ui/react](https://base-ui.com/)** - Headless UI primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Icons](https://react-icons.github.io/react-icons/)** - Additional icons

### **Authentication**

- **[Better Auth](https://www.better-auth.com/)** - Modern authentication library
- **[@better-auth/react](https://www.better-auth.com/)** - React integration

### **Form Management & Validation**

- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### **HTTP & Data Fetching**

- **[Axios](https://axios-http.com/)** - HTTP client
- Native `fetch` API for server components

### **Notifications**

- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript linting

---

## 📦 Dependencies

### **Production Dependencies**

```json
{
  "next": "^16.2.10",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@base-ui/react": "^1.10.0",
  "better-auth": "^1.4.3",
  "@better-auth/react": "^1.4.3",
  "react-hook-form": "^7.54.2",
  "@hookform/resolvers": "^3.10.0",
  "zod": "^3.24.2",
  "axios": "^1.7.9",
  "sonner": "^1.7.3",
  "lucide-react": "^0.468.0",
  "react-icons": "^5.4.0",
  "tailwindcss": "4.0.0"
}
```

### **Development Dependencies**

```json
{
  "typescript": "~5.7.2",
  "eslint": "^9",
  "eslint-config-next": "16.2.10",
  "@types/node": "^22",
  "@types/react": "^19",
  "@types/react-dom": "^19"
}
```

---

## 🚦 Getting Started

### **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm** 9.x or later (or **yarn** / **pnpm**)
- **Git**

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/imarufbillah/bloodos-client.git
   cd bloodos-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Better Auth Configuration
   BETTER_AUTH_SECRET=your-secret-key-min-32-chars
   BETTER_AUTH_URL=http://localhost:3000

   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # Optional: Analytics, Error Tracking, etc.
   # NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
   ```

   **Important:** Replace `your-secret-key-min-32-chars` with a secure random string (at least 32 characters).

4. **Verify backend server is running**

   The client requires the BloodOS server to be running. See the [server repository](https://github.com/imarufbillah/bloodos-server) for setup instructions.

   Default backend URL: `http://localhost:5000`

---

## 💻 Running the Project Locally

### **Development Mode**

Start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at **http://localhost:3000**

### **Production Build**

Build the optimized production bundle:

```bash
npm run build
npm run start
```

### **Linting**

Check code quality:

```bash
npm run lint
```

---

## 📁 Project Structure

```
bloodos-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/          # Public routes (landing, auth)
│   │   ├── (protected)/       # Protected routes (profile, requests)
│   │   ├── (admin)/           # Admin-only routes
│   │   ├── api/               # API routes (Better Auth)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── shared/            # Reusable components
│   │   └── forms/             # Form components
│   ├── lib/
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client
│   │   ├── api-client.ts      # API utility functions
│   │   ├── utils.ts           # Helper utilities
│   │   ├── constants/         # App constants
│   │   └── validators/        # Zod schemas
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── proxy.ts               # Middleware for route protection
├── public/                     # Static assets
├── .env.local                 # Environment variables (create this)
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
└── package.json               # Project dependencies
```

---

## 🌐 Deployment

### **Vercel (Recommended)**

BloodOS Client is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/imarufbillah/bloodos-client)

### **Other Platforms**

The application can be deployed to any Node.js hosting platform:

- **Netlify**
- **Railway**
- **Render**
- **DigitalOcean App Platform**

Ensure you set the correct environment variables and build command: `npm run build`

---

## 🔗 Important Links

- **Live Application:** [https://bloodos.vercel.app](https://bloodos.vercel.app)
- **Backend Server Repository:** [https://github.com/imarufbillah/bloodos-server](https://github.com/imarufbillah/bloodos-server)
- **API Documentation:** See server repository
- **Report Issues:** [GitHub Issues](https://github.com/imarufbillah/bloodos-client/issues)

---

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Landing Page

![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page)

### Browse Blood Requests

![Browse Requests](https://via.placeholder.com/800x400?text=Browse+Requests)

### Request Details

![Request Details](https://via.placeholder.com/800x400?text=Request+Details)

### Donor Directory

![Donor Directory](https://via.placeholder.com/800x400?text=Donor+Directory)

### User Profile

![User Profile](https://via.placeholder.com/800x400?text=User+Profile)

### Admin Dashboard

![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Md. Maruf Billah**

- GitHub: [@imarufbillah](https://github.com/imarufbillah)
- LinkedIn: [Md. Maruf Billah](https://linkedin.com/in/imarufbillah)
- Email: contact@marufbillah.com

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [shadcn](https://ui.shadcn.com/) for the beautiful component library
- [Better Auth](https://www.better-auth.com/) for modern authentication
- [Vercel](https://vercel.com/) for hosting and deployment
- All the blood donors who inspire this project 🩸

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐️ on GitHub!

---

<div align="center">

**Made with ❤️ for the people of Bangladesh**

[⬆ Back to Top](#bloodos-client-)

</div>
