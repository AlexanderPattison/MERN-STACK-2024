# MERN Stack E-Commerce Application

This project is a full-stack e-commerce application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It features user authentication, product browsing, wishlist functionality, and a shopping cart system.

## Features

- **User Authentication**: Sign up, log in, and log out functionality
- **Product Browsing**: View and search for products
- **Wishlist**: Add and remove items from a personal wishlist
- **Shopping Cart**: Add items to cart, adjust quantities, and remove items
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack
### Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs for password hashing
- express-session for session management
- connect-mongo for storing sessions in MongoDB
- express-rate-limit for API rate limiting

### Frontend:

- React.js
- React Router for navigation
- Axios for API requests
- React Icons

### Security:

- HTTPS
- CSRF protection
- Secure session management
- Input Sanitization
- Rate Limiting
- Secure Cookies
- CORS

## Prerequisites

- Node.js (v14 or later recommended)
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mern-ecommerce.git
    cd mern-ecommerce
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Install frontend dependencies:
    ```bash
    cd ../frontend
    npm install
    ```
4. Set up environment variables: Create a .env file in the backend directory and add the following:
    ```plaintext
    NODE_ENV=development
    HTTPS=true
    SSL_CRT_FILE=../server.cert
    SSL_KEY_FILE=../server.key
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    ```
    Replace your_mongodb_connection_string and your_session_secret with your actual MongoDB connection string and a secure random string.

5. Set up HTTPS:
Generate self-signed certificates for development:
    ```bash
    openssl req -nodes -new -x509 -keyout server.key -out server.cert
    ```

### Running the Application

1. Start the backend server:
    ```bash
    cd backend
    npm run dev
    ```
2. In a new terminal, start the frontend development server:
    ```bash
    cd frontend
    npm start
    ```
Open https://localhost:3000 in your browser to view the application.

### Seeding the Database
To populate the database with sample products:

1. Ensure your MongoDB is running and connection string is correct in .env
2. Run the seeding script:
    ```bash
    cd backend
    node seedDatabase.js
    ```

### Testing
1. Run backend tests:
    ```bash
    cd backend
    npm test
    ```

2. Run frontend tests:
    ```bash
    cd frontend
    npm test
    ```

### Deployment
For production deployment:

1. Build the React frontend:
    ```bash
    cd frontend
    npm run build
    ```
2. Set up your production environment variables in the backend .env file
3. Use a process manager like PM2 to run the Node.js server
4. Set up a reverse proxy with Nginx or Apache to serve the frontend build and proxy API requests to the backend

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.
