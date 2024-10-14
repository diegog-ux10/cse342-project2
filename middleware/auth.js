const jwt = require('jsonwebtoken');
const { getDb } = require('../database/database');
const { ObjectId } = require('mongodb');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDb();
    let userId;
    try {
      userId = ObjectId.createFromHexString(decoded.id);
    } catch (error) {
      console.error("Invalid ID format:", decoded.id);
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await db.collection('users').findOne({ _id: userId });


    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};