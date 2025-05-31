const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // ✅ this import is correct
const excelRoutes = require('./routes/excel');
const mongoose = require('mongoose');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');




mongoose.connect('mongodb://localhost:27017/excelAnalytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // needed to parse JSON bodies

// ✅ Add this line
app.use('/api/auth', authRoutes);  // 🔥 now /api/auth/signup will work

app.use('/api/excel', excelRoutes);

app.use('/api/users', profileRoutes);

app.use('/api/upload', uploadRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
