const Director = require('../models/director');
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/database'); // Import the getDb function

exports.getAllDirectors = async (req, res, next) => {
  try {
    const directors = await getDb.collection('directors').find().toArray();
    res.json(directors);
  } catch (error) {
    next(error);
  }
};

exports.getDirectorById = async (req, res, next) => {
  try {
    const director = await getDb.collection('directors').findOne({ _id: new ObjectId(req.params.id) });
    if (!director) {
      return res.status(404).json({ message: 'Director not found' });
    }
    res.json(director);
  } catch (error) {
    next(error);
  }
};

exports.createDirector = async (req, res, next) => {
  try {
    const director = new Director(
      req.body.name,
      req.body.birthYear,
      req.body.nationality
    );

    const errors = Director.validate(director);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await getDb.collection('directors').insertOne(director);
    res.status(201).json({ _id: result.insertedId, ...director });
  } catch (error) {
    next(error);
  }
};

exports.updateDirector = async (req, res, next) => {
  try {
    const director = new Director(
      req.body.name,
      req.body.birthYear,
      req.body.nationality
    );

    const errors = Director.validate(director);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await getDb.collection('directors').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...director, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }

    res.json({ message: 'Director updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteDirector = async (req, res, next) => {
  try {
    const result = await getDb.collection('directors').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Director not found' });
    }

    res.json({ message: 'Director deleted successfully' });
  } catch (error) {
    next(error);
  }
};