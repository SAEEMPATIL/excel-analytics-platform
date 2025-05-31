const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "myzidiointernship";

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('Signup request:', req.body); // 🐛 log incoming data

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error); // 🔍 debug exact error
    res.status(500).json({ message: 'Signup failed', error });
  }
};
