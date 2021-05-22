const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const app = express();

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

app.use(requestLogger);

app.post('/signin', loginValidator, login);
app.post('/signup', registrationValidator, createUser);

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
