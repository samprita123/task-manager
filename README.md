# Ethara AI - Advanced Team & Project Management

Ethara AI is a modern, full-stack project management platform designed for real-time collaboration, performance tracking, and data-driven decision making. The application features a high-end "Smoothing" pastel UI with cloud-synced analytics.

## 🚀 Live Access & Login

### **Admin Credentials**
To access the full management suite, use the following credentials:
*   **Email:** `sam123@gmail.com`
*   **Password:** `sam12345678`
*   **Role Selection:** Must select **"Admin"** from the toggle on the login page.

### **Member Access**
Team members can sign up via the Signup page or login with their registered emails (e.g., `member1@example.com`).

---

## 🛠️ Tech Stack
*   **Frontend:** React.js, Tailwind CSS, Framer Motion (Animations), Recharts (Analytics).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas (Cloud Database).
*   **Deployment:** Vercel (Frontend), Render (Backend).

---

## 📑 Core Features & Functionality

### 1. **Interactive Dashboard (The "Command Center")**
The dashboard provides a real-time 360-degree view of all project metrics:
*   **Monthly Trends:** Track received, completed, and pending projects for the current month.
*   **3D Status Weightage:** A visualized pie chart showing the distribution of project statuses.
*   **Delivery Performance:** A bar graph comparing "On-Time" vs "Late" completion probability based on due dates.
*   **Priority Matrix:** A sorted list of urgent projects that require immediate attention.
*   **Due Progress Track:** Real-time progress bars for upcoming deadlines.

### 2. **Project Management**
*   **Admin Control:** Admins can create new projects, assign multiple team members, set due dates, and manage priorities.
*   **Member Tracking:** Members can update the progress percentage (0-100%) of their assigned projects.
*   **Automatic Lifecycle:** Projects automatically move between "Pending", "In Progress", and "Completed" based on the progress percentage.

### 3. **Team Management (Admin Only)**
*   **Member Directory:** View all registered members, their roles, and their current activity status.
*   **Performance Monitoring:** Track how many projects each member is currently handling.
*   **Status Toggles:** Admins can see who is "Active" in the registry.

### 4. **Activity Feed**
*   The system tracks every major action (creating a project, updating progress, joining the team) and displays it in a global activity feed for transparency.

---

## ☁️ Cloud Synchronization
The application is fully connected to **MongoDB Atlas**. All data updates are permanent and shared across all devices in real-time. Whether you update progress on a mobile phone or a desktop, the change is reflected instantly for the entire team.

---

## 🛠️ Local Development Setup

1.  **Clone the repository.**
2.  **Backend Setup:**
    *   `cd backend`
    *   `npm install`
    *   Create a `.env` file with `MONGODB_URI`.
    *   `node index.js` (Server runs on port 5000).
3.  **Frontend Setup:**
    *   `cd frontend`
    *   `npm install`
    *   `npm run dev` (App runs on port 5173).

---

**Developed by Antigravity AI for Ethara AI.**
