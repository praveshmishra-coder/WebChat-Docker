# WebChat – Real-Time Chat Application

WebChat is a real-time chat application built to practice and demonstrate **authentication, JWT, SignalR, and Docker-based deployment**.  
The project follows a modern full-stack architecture with a **React frontend**, **ASP.NET Core backend**, and **SignalR** for real-time communication.

The entire application is **dockerized using Docker Compose**, making it easy to run locally or deploy consistently across environments.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 💬 Real-time messaging using SignalR
- ⚡ ASP.NET Core Web API backend
- 🌐 React (Vite) frontend
- 🐳 Fully Dockerized (Frontend + Backend)
- 📦 MongoDB integration (external / container-based)

---

## 🛠 Tech Stack

### Backend
- ASP.NET Core (.NET 8)
- SignalR
- JWT Authentication
- MongoDB
- Docker

### Frontend
- React (Vite)
- SignalR Client
- Nginx (for production build)
- Docker

### DevOps
- Docker
- Docker Compose

---

## 📂 Project Structure

WebChat-Docker/
│
├── SignalRChatApp/ # ASP.NET Core backend
│ └── Dockerfile
│
├── signalr-chat-react/ # React frontend
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md
