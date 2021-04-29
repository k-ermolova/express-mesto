const express = require('express');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const app = express();

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '608948b6a58010216020c0ed'
  };

  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});