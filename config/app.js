const express = require('express');
const path = require('node:path');
const app = express();

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));

module.exports = app; 