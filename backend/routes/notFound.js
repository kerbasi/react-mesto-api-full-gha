const router = require('express').Router();

const NotFoundError = require('../errors/not-found-error');

router.all('/*', NotFoundError);

module.exports = router;
