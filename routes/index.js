const express = require('express');
const movieRoutes = require('./movies');
const directorRoutes = require('./directors');

const router = express.Router();

router.use('/movies', movieRoutes);
router.use('/directors', directorRoutes);

module.exports = router;