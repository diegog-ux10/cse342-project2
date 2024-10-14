const { ObjectId } = require('mongodb');

class Movie {
  constructor(title, director, releaseYear, genre, rating, duration, cast) {
    this.title = title;
    this.director = director;
    this.releaseYear = releaseYear;
    this.genre = genre;
    this.rating = rating;
    this.duration = duration;
    this.cast = cast;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static validate(movie) {
    const errors = [];

    if (!movie.title || typeof movie.title !== 'string') {
      errors.push('Title is required and must be a string');
    }

    if (!movie.director || !ObjectId.isValid(movie.director)) {
      errors.push('Director ID is required and must be a valid ObjectId');
    }

    if (!movie.releaseYear || typeof movie.releaseYear !== 'number' || movie.releaseYear < 1888) {
      errors.push('Release year is required and must be a number greater than or equal to 1888');
    }

    if (!movie.genre || !Array.isArray(movie.genre) || movie.genre.length === 0) {
      errors.push('Genre is required and must be a non-empty array of strings');
    }

    if (typeof movie.rating !== 'number' || movie.rating < 0 || movie.rating > 10) {
      errors.push('Rating must be a number between 0 and 10');
    }

    if (typeof movie.duration !== 'number' || movie.duration <= 0) {
      errors.push('Duration must be a positive number');
    }

    if (!movie.cast || !Array.isArray(movie.cast) || movie.cast.length === 0) {
      errors.push('Cast is required and must be a non-empty array of strings');
    }

    return errors;
  }
}

module.exports = Movie;