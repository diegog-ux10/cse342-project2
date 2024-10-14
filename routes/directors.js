const express = require('express');
const directorController = require('../controllers/directors');

const router = express.Router();

router.get('/', directorController.getAllDirectors);
router.get('/:id', directorController.getDirectorById);
router.post('/', directorController.createDirector);
router.put('/:id', directorController.updateDirector);
router.delete('/:id', directorController.deleteDirector);

module.exports = router;