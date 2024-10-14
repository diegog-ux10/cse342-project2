const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movies');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { movieSchema } = require('../validationSchemas');

// #swagger.tags = ['Movies']
router.get('/', movieController.getAllMovies);

// #swagger.tags = ['Movies']
router.get('/:id', movieController.getMovieById);

// #swagger.tags = ['Movies']
router.post('/', auth, validate(movieSchema), movieController.createMovie);

// #swagger.tags = ['Movies']
router.put('/:id', auth, validate(movieSchema), movieController.updateMovie);

// #swagger.tags = ['Movies']
router.delete('/:id', auth, movieController.deleteMovie);

module.exports = router;