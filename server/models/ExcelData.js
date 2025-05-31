const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadDate: { type: Date, default: Date.now },
  data: Array,  // parsed Excel data as JSON
});

module.exports = mongoose.model('ExcelData', excelDataSchema);
