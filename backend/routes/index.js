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

app.post('/signin', celebrate(celebrateValidationSignin), login);
app.post('/signup', celebrate(celebrateValidationSignup), createUser);

app.use('/cards', auth, cardRouter);
app.use('/users', auth, userRouter);
app.all('/*', auth, NotFoundError);

module.exports = router;
