const mongoose = require('mongoose');
const FormData = require('../model/form'); // Import the FormData model

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/mauli_driving", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

// Function to insert sample data
const insertData = async () => {
  try {
    const formData = new FormData({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      course: 'Computer Science',
      message: 'Looking forward to the course!',
    });

    const savedData = await formData.save(); // Save to the database
    console.log('Form Data Saved:', savedData);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Execute functions
const init = async () => {
  await connectDB(); // Connect to DB
  await insertData(); // Insert sample data
};

init();
