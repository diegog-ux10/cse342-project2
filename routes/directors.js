const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directors');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { directorSchema } = require('../validationSchemas');

// #swagger.tags = ['Directors']
router.get('/', directorController.getAllDirectors);

// #swagger.tags = ['Directors']
router.get('/:id', directorController.getDirectorById);

// #swagger.tags = ['Directors']
router.post('/', auth, validate(directorSchema), directorController.createDirector);

// #swagger.tags = ['Directors']
router.put('/:id', auth, validate(directorSchema), directorController.updateDirector);

// #swagger.tags = ['Directors']
router.delete('/:id', auth, directorController.deleteDirector);

module.exports = router;