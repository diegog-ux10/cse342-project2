const Director = require('../models/director');
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/database');

exports.getAllDirectors = async (req, res, next) => {
  try {
    const db = getDb();
    const directors = await db.collection('directors').find().toArray();
    res.json(directors);
  } catch (error) {
    next(error);
  }
};

exports.getDirectorById = async (req, res, next) => {
  try {
    const db = getDb();
    const director = await db.collection('directors').findOne({ _id: new ObjectId(req.params.id) });
    if (!director) {
      return res.status(404).json({ message: 'Director not found' });
    }
    res.json(director);
  } catch (error) {
    if (error instanceof ObjectId.TypeError) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.createDirector = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('directors').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Director already exists' });
    }
    next(error);
  }
};

exports.updateDirector = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('directors').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }
    res.json({ message: 'Director updated successfully' });
  } catch (error) {
    if (error instanceof ObjectId.TypeError) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Director with this name already exists' });
    }
    next(error);
  }
};

exports.deleteDirector = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('directors').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }
    res.json({ message: 'Director deleted successfully' });
  } catch (error) {
    if (error instanceof ObjectId.TypeError) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(error);
  }
};