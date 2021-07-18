const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const app = express();

const cors = require('cors');

const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const notFoundRoutes = require('./routes/notFound');
const { login, createUser } = require('./controllers/users');
const { registrationValidator, loginValidator } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/sign-in', loginValidator, login);
app.post('/sign-up', registrationValidator, createUser);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', notFoundRoutes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
