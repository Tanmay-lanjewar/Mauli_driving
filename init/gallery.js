const mongoose = require('mongoose');
const Gallery = require('../model/gallery'); // Replace with the actual path to your Gallery model

mongoose.connect('mongodb://localhost:27017/mauli_driving', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const seedGallery = async () => {
  try {
    const gallery = new Gallery({
      image1: 'https://picsum.photos/200/300?random=1',
      image2: 'https://picsum.photos/200/300?random=2',
      image3: 'https://picsum.photos/200/300?random=3',
      image4: 'https://picsum.photos/200/300?random=4',
      image5: 'https://picsum.photos/200/300?random=5',
      image6: 'https://picsum.photos/200/300?random=6',
      image7: 'https://picsum.photos/200/300?random=7',
      image8: 'https://picsum.photos/200/300?random=8',
      image9: 'https://picsum.photos/200/300?random=9'
    });

    await gallery.save();
    console.log('Gallery seeded with 9 images');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding gallery:', err);
  }
};

seedGallery();
