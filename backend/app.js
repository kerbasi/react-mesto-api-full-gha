require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate } = require('celebrate');

const app = express();

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { celebrateValidationSignin, celebrateValidationSignup } = require('./middlewares/celebrateValidation');
const errorHandler = require('./middlewares/error-handler');

const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 4000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect(DB_URL);

app.use(limiter);
app.use(helmet());

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate(celebrateValidationSignin), login);
app.post('/signup', celebrate(celebrateValidationSignup), createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));
app.all('/*', auth, require('./controllers/error'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
});
