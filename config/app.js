const express = require('express');
const path = require('node:path');
const app = express();
require('dotenv').config();

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    apiLimit: process.env.API_LIMIT || '100kb',
    uploadDir: process.env.UPLOAD_DIR || 'public/uploads'
}; 