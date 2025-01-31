const app = require('./config/app');
require('dotenv').config();

// Import des routes
const authRoutes = require('./app/routes/auth');
const recipeRoutes = require('./app/routes/recipes');
const categoryRoutes = require('./app/routes/categories');

// Utilisation des routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);

// Route principale
app.get('/', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 