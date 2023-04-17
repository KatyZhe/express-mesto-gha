const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { auth } = require('./middlewares/auth');
const { Errors } = require('./errors/Errors');
const { login, createUser} = require('./controllers/users');
const { validateUser } = require('./validation/validation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.post('/signin', validateUser, login);
app.post('/signup', validateUser, createUser); 

app.use(() => {
  throw Errors.notFound('Страница не найдена');
});

app.listen(PORT, () => {
  console.log(`Server starts on ${PORT}`);
});
