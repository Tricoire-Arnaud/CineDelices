# shebang.
# indique que ce fichier doit être exécuté par Bash
#!/bin/bash

# automatise le processus d'installation
# des dépendances, de compilation de CSS et de démarrage du serveur en production, 
# tout en vérifiant que chaque étape réussit avant de passer à la suivante.

echo "Lancement du setup-prod (sans tailwind)"
npm run init-db
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de setup-prod"
  exit 1
fi

echo "Lancement en production"
npm run start
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de start-prod"
  exit 1
fi
