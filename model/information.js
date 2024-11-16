const mongoose = require('mongoose');


const informationSchema = new mongoose.Schema({
  image1: {
    type: String,
    required: true, // Make it required
  },
  image2: {
    type: String,
    required: true, // Make it required
  },
  header: {
    type: String,
    required: true, // Make it required
  },
  paragraph: {
    type: String,
    required: true, // Make it required
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const Information = mongoose.model('Information', informationSchema);

module.exports = Information;
