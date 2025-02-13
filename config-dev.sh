# shebang.
# indique que ce fichier doit être exécuté par Bash
#!/bin/bash

# ce script permet de s'assurer que chaque étape (initialisation de l'environnement de développement et lancement du serveur)
# se déroule correctement. 
# Si une étape échoue, il affiche un message d'erreur et arrête l'exécution.

echo "Lancement du setup-dev (init-db & tailwind)"
npm run setup-dev
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de setup-dev"
  exit 1
fi

echo "Lancement en developpement"
npm run dev
if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution de start-dev"
  exit 1
fi
