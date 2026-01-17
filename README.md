# Realtime Chat Application (MERN Stack)

A full-stack real-time chat application built using the MERN stack. This project includes secure user authentication, real-time messaging, image sharing, and a responsive user interface. It is designed following clean architecture and industry-standard development practices.

## Features

- User authentication using JWT
- Secure password hashing
- One-to-one real-time chat
- Online and offline user status
- Image sharing in chat
- Emoji support
- Responsive design for mobile and desktop
- MongoDB Atlas database
- Cloudinary for image storage
- Centralized error handling

## Tech Stack

Frontend
- React
- Tailwind CSS
- Zustand

Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- Cloudinary

## Project Structure

chat-app/
client/
server/
server/src/
controllers/
routes/
models/
middlewares/
lib/
server.js
.env.example
.gitignore
README.md

## Installation and Setup

Step 1: Clone the repository

git clone https://github.com/Prakhar0136/RealTime_Chat_Application
cd RealTime_Chat_Application

Step 2: Backend setup

cd server
npm install
npm run dev

Create a .env file in the server directory using .env.example as reference.

Step 3: Frontend setup

cd client
npm install
npm run dev

## Environment Variables

Create a .env file inside the server folder and configure the following variables.

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

## Key Learnings

- Implemented secure authentication and authorization
- Designed REST APIs with clean separation of concerns
- Built scalable backend architecture
- Managed global state using Zustand
- Integrated cloud-based image storage
- Deployed full-stack application to production

## Author

Prakhar Shakya

GitHub: https://github.com/Prakhar0136/RealTime_Chat_Application
LinkedIn: https://www.linkedin.com/in/prakhar-shakya-b600b7313/
