const router = require('express').Router();

const { celebrate } = require('celebrate');

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const {
  createUser,
  login,
} = require('../controllers/users');
const { celebrateValidationSignin, celebrateValidationSignup } = require('../middlewares/celebrateValidation');

router.post('/signin', celebrate(celebrateValidationSignin), login);
router.post('/signup', celebrate(celebrateValidationSignup), createUser);

router.use('/cards', auth, cardRouter);
router.use('/users', auth, userRouter);
router.all('/*', auth, NotFoundError);

module.exports = router;
