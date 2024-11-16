const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  image4: { type: String, required: true },
  image5: { type: String, required: true },
  image6: { type: String, required: true },
  image7: { type: String, required: true },
  image8: { type: String, required: true },
  image9: { type: String, required: true }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
