const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getDb } = require('../database/database');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const db = getDb();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create new user
    const hashedPassword = await User.hashPassword(password);
    const newUser = new User(username, email, hashedPassword);
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const db = getDb();

    // Find user
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and send token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};