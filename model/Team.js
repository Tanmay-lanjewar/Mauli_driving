const mongoose = require('mongoose');

// Define the TeamMember schema
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  socialLinks: {
    facebook: { type: String, required: false },
    googlePlus: { type: String, required: false },
    twitter: { type: String, required: false },
    linkedin: { type: String, required: false }
  }
});

// Create the TeamMember model
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
