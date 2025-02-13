# shebang.
# indique que ce fichier doit être exécuté par Bash
#!/bin/bash

# automatise le processus d'installation
# des dépendances, de compilation de CSS et de démarrage du serveur en production, 
# tout en vérifiant que chaque étape réussit avant de passer à la suivante.

echo "Lancement de la production..."

# Installation des dépendances de production
echo "Installation des dépendances de production..."
npm i --omit=dev
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'installation des dépendances"
  exit 1
fi

# Compilation de Tailwind CSS en mode production
echo "Compilation de Tailwind CSS..."
npx tailwindcss -i ./public/CSS/input.css -o ./public/CSS/output.css --minify
if [ $? -ne 0 ]; then
  echo "Erreur lors de la compilation de Tailwind CSS"
  exit 1
fi

# Lancer le serveur de production (ici avec `node` ou ton gestionnaire de production comme PM2)
echo "Lancement du serveur de production..."
npm run start
if [ $? -ne 0 ]; then
  echo "Erreur lors du lancement du serveur de production"
  exit 1
fi

echo "Serveur de production démarré avec succès."
