# Swasthya Sathi 🏥

Welcome to the **Swasthya Sathi** Healthcare Platform! This is a comprehensive MERN stack (MongoDB, Express, React, Node.js) application featuring dedicated dashboards for Patients, Doctors, and Administrators, with a premium dark-themed UI.

---

## 🚀 Quick Start Guide for Developers

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Ensure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port `27017`)
- [Git](https://git-scm.com/)

---

### 2. Clone the Repository
Open your terminal and run:
```bash
git clone <YOUR_GITHUB_REPO_URL_HERE>
cd hope
```

---

### 3. Setup the Backend (Server)
The backend handles API requests, database connections, and file uploads.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables (`.env`):**
   *Note: For security reasons, the `.env` file is NOT uploaded to GitHub.*
   - Copy the `.env.example` file and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ask the project owner (Sam) for the actual Cloudinary API keys and JWT secret, and paste them into your new `backend/.env` file. It should look something like this:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/swasthyasathi
     JWT_SECRET=your_secret_key_here
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ADMIN_EMAIL=admin1@hotmail.com
     ADMIN_PASSWORD=1111
     ```

4. Start the backend server:
   ```bash
   npm start
   ```
   *The server should now be running on `http://localhost:5000`.*

---

### 4. Setup the Frontend (Client)
The frontend is built with React, Vite, TailwindCSS, and Framer Motion.

1. Open a **new** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The React app should now be running. Click the local link (usually `http://localhost:5173`) to view the website.*

---

### 🔑 Test Accounts
Once running, you can use these accounts to explore the platform:

**Admin Dashboard:**
- Email: `admin1@hotmail.com`
- Password: `1111`

**Doctor & Patient:**
- Register a new account via the website to test the flow!

---

### 🛠️ Troubleshooting
- **MongoDB Error:** If the backend crashes with a `MongoTimeoutError`, ensure your local MongoDB service is running.
- **Upload Errors:** If image uploads fail, verify that your Cloudinary credentials in `backend/.env` are correct.
- **Node Modules Error:** If you see "module not found" errors, delete the `node_modules` folder and `package-lock.json` in both frontend and backend, then run `npm install` again.
