const express = require('express');
const router = express.Router();
const multer = require('multer');


// Use multer to parse file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });



   

module.exports = router;
