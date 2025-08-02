## 🚀 Features

### 🔐 Authentication
- **Email & Password Login**: Secure sign-up and login with email credentials.
- **Google Authentication**: Sign in quickly using a Google account via Firebase Auth.
- **GitHub Authentication**: Log in using GitHub with profile name fetching.
- **Session Protection**: Prevents back-navigation to login once authenticated.
- **Protected Routes**: Ensures only authenticated users can access the dashboard.

### 📋 Task List UI
- **Minimal Design**: Clean layout showing tasks in a tabular format with fixed-width columns.
- **Status Column**: Toggle between `Pending`, `In Progress`, and `Completed` without disrupting layout.
- **Action Column**: A fixed `Delete` button on the right for quick removal.
- **Scroll Stability**: Task titles, status, and actions stay aligned regardless of text length.

### 🧠 Task Management
- **Add New Tasks**: Users can input and save tasks with a selected status.
- **Status Toggle**: Easily update status of existing tasks via a button.
- **Delete Tasks**: Remove unwanted tasks with a single click.
- **User-Specific Data**: Each user's task list is isolated and stored securely in Firestore.

### 💥 Real-Time UI & UX Enhancements
- **Animated Loader**: Fun loading animations during auth or data fetch.
- **Dynamic Backgrounds**: Patterned animated backgrounds on login/signup pages.
- **Custom Icons & Branding**: Lucide icons (e.g. Headphones) and app name branding (e.g. *AIM Dashboard*).
- **Mobile Responsive**: Optimized for all screen sizes using Tailwind CSS.

### ☁️ Deployment & Hosting
- **Deployed via Vercel**: Leveraging fast and efficient Next.js deployment on Vercel.
- **CI/CD Integration**: Automatic updates via GitHub push to `main`.

### 🔥 Firebase Integration
- **Firestore Database**: Stores user data & tasks in real-time.
- **Firebase Auth**: Manages auth via email, Google, and GitHub.
- **Secure Config**: Environment variables used to protect keys and tokens.

### 📸 Screenshots

#### 🔐 Login Page
![Login Page](./screenshots/login.png)

#### 📊 Dashboard
![Dashboard](./screenshots/dashboard.png)




## 🛠️ Tech Stack

- **Frontend**: React, Next.js 14, TailwindCSS
- **Backend/Auth**: Firebase Auth, Firestore
- **Deployment**: Vercel
- **Design**: Lucide Icons, custom animations


