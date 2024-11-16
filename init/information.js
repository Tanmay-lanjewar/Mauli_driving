const mongoose = require('mongoose');
const Information = require("../model/information"); // Update the path if needed

const mongoURI = 'mongodb://localhost:27017/mauli_driving'; // Replace with your MongoDB connection string

const initData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully');

    // Create initial data
    const initialInfo = {
      image1: '/assets/images/resource/image-1.jpg',
      image2: '/assets/images/resource/image-2.jpg',
      header: "We’re an Experienced, Trustworthy, Reliable & Friendly Driving School",
      paragraph: `Our driving school is being recognized by Government of Maharashtra. Driving school Founder Mr. Ajay Bhujade holding 10+ years of experience in this profession proving excellent hand holding training. Our school understands what our learner driver needs, we make our Learner Driver also understand how to respond appropriately to the heavy traffic, traffic signals, controlling in traffic and pedestrians. We provide training for 4 wheelers with driving license. Mauli Driving School offers you the most economical and the best possible comprehensive driving education. Training is provided in petrol cars for better practice. Our motto is "to provide training with safety which is very important for any individual."`
    };

    // Create and save the document
    const info = new Information(initialInfo);
    await info.save();
    console.log('Initial data saved successfully');

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

initData();
