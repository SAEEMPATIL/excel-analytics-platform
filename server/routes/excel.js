const express = require('express');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const ExcelFile = require('../models/ExcelData');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// UPLOAD ROUTE
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const newExcelFile = new ExcelFile({
      filename: req.file.filename, // saved filename
      originalname: req.file.originalname, // original name from user
      data: jsonData
    });

    await newExcelFile.save();

    res.status(201).json({
      message: 'File uploaded and parsed successfully',
      fileId: newExcelFile._id,
      filename: newExcelFile.originalname, // show user
      serverFilename: newExcelFile.filename // actual file stored on server
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed', error });
  }
});

// FETCH PARSED EXCEL DATA
router.get('/data/:fileId', async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json({ data: file.data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
});

// ✅ DOWNLOAD USING ORIGINAL NAME (LOOKUP ACTUAL FILE)
router.get('/download/:originalname', async (req, res) => {
  try {
    const file = await ExcelFile.findOne({ originalname: req.params.originalname });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filepath = path.join(__dirname, '..', 'uploads', file.filename);
    return res.download(filepath, file.originalname); // downloaded as original name
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ message: 'Server error during file download' });
  }
});

module.exports = router;
