const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  ERR_NOT_FOUND
} = require('./errors/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64312ffee1ce4135e6e4a62b',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
app.use((req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Server starts on ${PORT}`);
});
