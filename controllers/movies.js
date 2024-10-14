const Movie = require('../models/movie');
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/database');

exports.getAllMovies = async (req, res, next) => {
  try {
    const db = getDb();
    const movies = await db.collection('movies').find().toArray();
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const db = getDb();
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(req.params.id) });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    if (error instanceof ObjectId.TypeError) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('movies').insertOne(req.body);
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (error) {
    next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie updated successfully' });
  } catch (error) {
    if (error instanceof ObjectId.TypeError) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    if (error instanceof ObjectId.TypeError) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next(error);
  }
};