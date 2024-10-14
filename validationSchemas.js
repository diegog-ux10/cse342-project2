const Joi = require('joi');

const movieSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required(), // Assuming director is stored as ObjectId string
  releaseYear: Joi.number().integer().min(1888).required(),
  genre: Joi.array().items(Joi.string()).min(1).required(),
  rating: Joi.number().min(0).max(10).required(),
  duration: Joi.number().integer().positive().required(),
  cast: Joi.array().items(Joi.string()).min(1).required()
});

const directorSchema = Joi.object({
  name: Joi.string().required(),
  birthYear: Joi.number().integer().min(1800).required(),
  nationality: Joi.string().required()
});

module.exports = { movieSchema, directorSchema };