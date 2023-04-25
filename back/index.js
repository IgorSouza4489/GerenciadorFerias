const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const feriasController = require('./controllers/feriasController');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', );  next();
});

app.use('/auth', authController);
app.use('/users', userController);
app.use('/ferias', feriasController);


app.listen(3000, () => {
  console.log(`http://localhost:${3000}`);
});