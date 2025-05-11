const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Set up Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Use original file name and add a timestamp to avoid name conflicts
    cb(null, Date.now() + path.extname(file.originalname));  // Corrected here
  }
});

const upload = multer({ storage: storage });

// File upload route
app.post('/api/file/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send('File uploaded successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
