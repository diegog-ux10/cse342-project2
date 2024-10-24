const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/auth', require('./auth'));
router.use('/oauth', require('./oauth'));
router.use('/movies', require('./movies'));
router.use('/directors', require('./directors'));

module.exports = router;