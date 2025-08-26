# 🛰️ OverWatch – Your Intelligent Productivity App

![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-in%20development-yellow)  ![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen) ![React Native](https://img.shields.io/badge/React%20Native-in%20progress-blue)  

## 📖 About the Project
**OverWatch** aims to be **intelligent productivity app** that works as an advanced agenda.  
It not only organizes your tasks but also **analyzes, categorizes, and suggests improvements** to your routine.  
The goal is to help you achieve **well-being, health, and professional growth**, acting as an assistant that learns from your habits and adapts to your lifestyle.  

🔹 Planned features:  
- ✔️ Task CRUD  
- ✔️ User authentication with JWT  
- ✔️ Integration with **MongoDB Atlas** database  
- ⏳ Task sorting and pagination  
- ⏳ Intelligent suggestions based on habits  
- ⏳ Mobile app in **React Native**  

---

## 🛠️ Technologies Used
- **Back-end:** Node.js, Express, MongoDB, JWT, dotenv  
- **Front-end (coming soon):** React Native, Vite, Context API, Tailwind  
- **Infra:** Railway (back-end deploy), MongoDB Atlas (cloud DB)  

---

## 🚀 Running Locally

### Requirements
- Node.js (>=18)  
- Local MongoDB or MongoDB Atlas account  
- Git  

### Steps
```bash
# Clone the repository
git clone https://github.com/your-username/overwatch.git

# Enter the folder
cd overwatch

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

In the `.env` file, configure:  
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Then run:  
```bash
npm run dev
```

The API will be available at:  
👉 `http://localhost:3000`

---

## 📡 Main API Routes
### Authentication
- `POST /auth/register` → Create user  
- `POST /auth/login` → Login and generate token  

### Tasks
- `GET /tasks` → List tasks  
- `POST /tasks` → Create task  
- `PATCH /tasks/:id` → Update task  
- `DELETE /tasks/:id` → Delete task  

---

## 📌 Roadmap
- [x] Basic API with authentication  
- [ ] Deploy on Railway  
- [ ] Sorting and pagination  
- [ ] Mobile app in React Native  
- [ ] AI-powered personalized suggestions  

---

## 📄 License
This project is licensed under the MIT License.  
Feel free to use and modify it!  
