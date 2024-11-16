// init.js
const mongoose = require('mongoose');
const Admin = require('../model/admin'); // Replace with the actual path to your Admin model file

// Replace with your MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/mauli_driving';

async function connectToDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Function to create an admin for testing (optional)
async function createAdmin() {
    try {
        const admin = new Admin({
            username: 'Tanmay',
            password: 'tanmay5280' // Make sure to hash passwords in a real-world app
        });
        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Connect to the database and optionally create an admin
connectToDB().then(() => {
    // Call createAdmin() only if you want to create a new admin user for testing
    createAdmin();
});
