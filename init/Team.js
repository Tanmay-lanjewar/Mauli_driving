// Import required libraries
const mongoose = require('mongoose');
const TeamMember = require('../model/Team'); // Import the model (make sure the path is correct)

// MongoDB connection string (replace with your MongoDB URL)
const mongoURI = 'mongodb://localhost:27017/mauli_driving';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Function to initialize the data (inserting sample team members)
const initializeData = async () => {
  // Sample team members
  const teamMembers = [
    {
      name: 'Ajay V. Bhujade',
      role: 'Founder / Manager',
      imageUrl: 'https://example.com/images/ajay_bhujade.jpg',
      socialLinks: {
        facebook: 'https://facebook.com/ajaybhujade',
        googlePlus: 'https://plus.google.com/ajaybhujade',
        twitter: 'https://twitter.com/ajaybhujade',
        linkedin: 'https://linkedin.com/ajaybhujade'
      }
    },
    {
      name: 'Yogita A. Bhujade',
      role: 'Administrative Assistant',
      imageUrl: 'https://example.com/images/yogita_bhujade.jpg',
      socialLinks: {
        facebook: 'https://facebook.com/yogitabhujade',
        googlePlus: 'https://plus.google.com/yogitabhujade',
        twitter: 'https://twitter.com/yogitabhujade',
        linkedin: 'https://linkedin.com/yogitabhujade'
      }
    }
  ];

  try {
    // Insert team members into the database
    await TeamMember.insertMany(teamMembers);
    console.log('Team members added successfully');
  } catch (error) {
    console.error('Error inserting team members:', error.message);
  }
};

// Main function to run the init script
const main = async () => {
  await connectDB();   // Connect to the database
  await initializeData();  // Insert initial data
  mongoose.connection.close(); // Close the connection once done
};

main();




