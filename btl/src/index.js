const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/index');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// MongoDB connection options
const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, mongoOptions)
    .then(() => {
        console.log('MongoDB is connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Mount routes
routes(app);

// List all registered routes
app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log(`Registered route: ${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Expense Management API' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'ERR',
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        status: 'ERR',
        message: err.message || 'Internal Server Error'
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port or stop the other process.`);
    } else {
        console.error('Error starting server:', err);
    }
    process.exit(1);
});