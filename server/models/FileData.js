const mongoose = require('mongoose');

const fileDataSchema = new mongoose.Schema({
  filename: String,
  data: [mongoose.Schema.Types.Mixed], // flexible for Excel rows
}, { timestamps: true });

module.exports = mongoose.model('FileData', fileDataSchema);
