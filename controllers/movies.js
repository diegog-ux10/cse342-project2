const Movie = require('../models/movie');
const { ObjectId } = require('mongodb');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await req.app.locals.db.collection('movies').find().toArray();
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await req.app.locals.db.collection('movies').findOne({ _id: new ObjectId(req.params.id) });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const movie = new Movie(
      req.body.title,
      new ObjectId(req.body.director),
      req.body.releaseYear,
      req.body.genre,
      req.body.rating,
      req.body.duration,
      req.body.cast
    );

    const errors = Movie.validate(movie);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await req.app.locals.db.collection('movies').insertOne(movie);
    res.status(201).json({ _id: result.insertedId, ...movie });
  } catch (error) {
    next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const movie = new Movie(
      req.body.title,
      new ObjectId(req.body.director),
      req.body.releaseYear,
      req.body.genre,
      req.body.rating,
      req.body.duration,
      req.body.cast
    );

    const errors = Movie.validate(movie);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await req.app.locals.db.collection('movies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...movie, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const result = await req.app.locals.db.collection('movies').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};