# MERN-STACK-2024

A comprehensive project using the MERN stack (MongoDB, Express.js, React, and Node.js) for building a full-fledged web application. This project demonstrates the integration of these technologies to create a robust and scalable web application.

## Features

- **Self-Certification**: Self-cert for HTTPS. This should eventually change by use of properly signed certificates from trusted authorities for production deployments.
- **User Authentication**: Secure login and registration using session-based authentication.
- **CRUD Operations**: Full Create, Read, Update, Delete functionality.
- **Responsive Design**: Mobile-friendly design using CSS and Bootstrap.
- **RESTful API**: Backend API development with Express and Node.js.
- **MongoDB Integration**: Data storage and management with MongoDB.
- **State Management**: Efficient state management using React Hooks and Context API.

## Installation

### Prerequisites

- Node.js
- npm
- MongoDB

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/AlexanderPattison/MERN-STACK-2024.git
    cd MERN-STACK-2024
    ```

2. Install server dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Install client dependencies:
    ```bash
    cd frontend
    npm install
    ```

4. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```plaintext
    NODE_ENV=development
    HTTPS=true
    SSL_CRT_FILE=../server.cert
    SSL_KEY_FILE=../server.key
    PORT=5000
    MONGO_URI=
    SESSION_SECRET=
    ```

5. Start the development servers:
    ```bash
    # In the backend directory
    npm run dev

    # In the frontend directory
    npm start
    ```

## Usage

- Visit `http://localhost:3000` to view the application.
- Use Postman or any other API client to test the backend endpoints at `http://localhost:5000/api`.
