const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const FileData = require('../models/FileData'); // you'll create this

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const savedData = await FileData.create({ filename: req.file.originalname, data });
    res.status(200).json({ message: 'File uploaded and parsed', savedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
