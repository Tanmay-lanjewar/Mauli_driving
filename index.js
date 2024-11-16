const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const path = require('path');
const Information = require("./model/information"); 
const mongoose = require("mongoose");
const Team = require("./model/Team");
const { console } = require('inspector');
var methodOverride = require('method-override');
const TeamMember = require('./model/Team');
const Gallery = require('./model/gallery');
const admin_db = require('./model/admin');
const { lstat } = require('fs');
const form_db = require("./model/form")
const cors = require('cors');
app.use(cors());

 
app.use(methodOverride('_method'));

// Set EJS as the template engine
app.set('view engine', 'ejs');


app.use(express.json()); // Add this middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data


async function connect_db(){
 await mongoose.connect('mongodb://localhost:27017/mauli_driving');

  
 
  console.log('MongoDB connected successfully');
}

connect_db();

// Set the public folder to serve static files like CSS and JavaScript
app.use(express.static('public'));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with the current timestamp
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully!');
});

// Define a route
app.get('/', (req, res) => {
  Promise.all([
    Information.find(),
    Team.find(),
    Gallery.find(),
    admin_db.find(),
    form_db.find()
  ])
    .then(([informationData, teamData, galleryData, adminData, formData]) => {
      res.render('index', {
        information: informationData,
        team: teamData,
        gallery: galleryData,
        admin: adminData,
        form: formData
      });
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      res.status(500).send("Internal Server Error");
    });
  
});

// PUT route for updating text information
app.post("/information/text", (req, res) => {
  const data = req.body;
  console.log(data._id);
   Information.updateOne(
    { "$set": { "header": data.header, "paragraph": data.paragraph } }
  )
    .then(() => {
      console.log("Text information updated successfully");
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.error("Error updating text information:", err);
      res.redirect("/dashboard");
    });
});


// PUT route for updating images
app.post("/information/images", upload.fields([{ name: "image1" }, { name: "image2" }]), (req, res) => {
  try {
    const { files } = req;
    const updatedData = {};

    if (files.image1) {
      updatedData.image1 = `/uploads/${files.image1[0].filename}`;
    }

    if (files.image2) {
      updatedData.image2 = `/uploads/${files.image2[0].filename}`;
    }

    
    // Assuming there's a single record in the information_data collection
    Information.updateOne({}, { $set: updatedData })
      .then(() => {
        console.log("Images updated successfully");
        res.redirect("/dashboard");
      })
      .catch((err) => {
        console.error("Error updating images:", err);
        res.redirect("/dashboard");
      });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.redirect("/dashboard");
   
  }
});

app.get("/teammember", (req, res) => {  
   Team.find()
   .then((data) => {
    console.log(data);
    res.render("team_member", { data: data });
  });
 
});



app.delete("/team/delete", (req, res) => {
  let id = req.body.id;
  TeamMember.findByIdAndDelete(id)
    .then(() => {
      console.log("Team member deleted successfully");
      res.redirect("/teammember");
    })
    .catch((err) => {
      console.error("Error deleting team member:", err);
      res.redirect("/teammember");
    });
});

app.get('/rto', (req, res) => {
  res.render('rto');
});

app.get('/dashboard', (req, res) => {
  Information.find().then((data) => {
    console.log(data[0]);
    res.render("dashboard", { data: data[0] });
  });
 
}); 

app.post('/team/add', upload.single('imageUrl'),(req,res)=>{
   // req.file contains information about the uploaded file
   console.log(req.file);

   // req.body contains the form text inputs (name, role, social URLs)
   console.log(req.body);
   const imageUrl = req.file ? req.file.path : ''; 

   TeamMember.collection.insertOne({
      name:req.body.name,
      role:req.body.role,
      imageUrl:imageUrl,
      socialLinks:{
        facebook:req.body.facebook,
        googlePlus:req.body.googlePlus,
        twitter:req.body.twitter,
        linkedin:req.body.linkedin
      }
   })
   .then( (resu)=>{
    console.log("data inserted");
    res.redirect("/teammember");
   })
 
  
})

app.put("/gallery/:id", upload.single("imageFile"), async (req, res) => {
  try {
    let number = req.params.id;
    let imageField = "image" + number;

    // Extract the new image URL from the uploaded file
    let newImageUrl = req.file ? req.file.path : null;

    if (!newImageUrl) {
      return res.status(400).send("No image file provided");
    }

    // Update the first document found in the collection with the new image URL
    const updatedGallery = await Gallery.findOneAndUpdate(
      {}, // Empty filter to match the first document
      { [imageField]: newImageUrl }, // Dynamic field update
      { new: true, runValidators: true } // Options to return the updated document and validate data
    );

    if (updatedGallery) {
      console.log('Image updated successfully:', updatedGallery);
      res.redirect("/admin/gallery");
    } else {
      console.log('No gallery found to update');
      res.status(404).send("Gallery not found");
    }
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).send("Internal Server Error");
  }
});


app.put("/team/edit", upload.single("imageUrl"), (req, res) => {

  const updatedData = {
    name: req.body.name,
    role: req.body.role,
    imageUrl: req.file ? req.file.path : req.body.imageUrl,
    socialLinks: {
      facebook: req.body.facebook,
      googlePlus: req.body.googlePlus,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin
    }
  };

  TeamMember.findByIdAndUpdate(req.body.edit_id, updatedData)
    .then(() => {
      console.log("Team member updated successfully");
      res.redirect("/teammember");
    })
    .catch((err) => {
      console.error("Error updating team member:", err);
      res.redirect("/teammember");
    });
});



// Route to get a team member by ID
app.get("/teammember/:id", (req, res) => {
  const memberId = req.params.id;

  TeamMember.findById(memberId)
      .then((member) => {
          if (member) {
              res.json(member); // Send the data as JSON
          } else {
              res.status(404).send({ message: "Member not found" });
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send({ message: "Error retrieving member data" });
      });
});

app.get("/admin/gallery",(req,res)=>{
  Gallery.find().then((data)=>{
  
    res.render("Gallery",{data:data});
  })
})


app.post("/admin/login" ,(req,res)=>{
  let id=req.body.user_id;
  let password = req.body.password;
  admin_db.findOne({ username: id, password: password })
  .then((user) => {
    if (user) {
      res.json({success:true});
    } else {
      res.json({success:false});
    }
  })
  .catch((err) => {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  });

  
})

app.post("/form/submit",async(req,res)=>{

  
  const insertData = async () => {
    try {
      const formData = new form_db({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        course: req.body.course,
        message: req.body.message
      });
  
      const savedData = await formData.save(); // Save to the database
      res.json({success:true})
      console.log('Form Data Saved:', savedData);
    } catch (error) {
      res.json({success:false})
      console.error('Error inserting data:', error);
    }
  };
  
// Execute functions
const init = async () => {
 
  await insertData(); // Insert sample data
};

init();
   
  

})


app.get("/admin/form",(req,res)=>{
  form_db.find()
  .then((resu)=>{
    
    res.render("admin_form",{data:resu})
  })
  .catch((e)=>{
    res.send("Error 404")
  })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
