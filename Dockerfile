# Fichier de configuration d'une image

# On sélectionne une image Node pour notre projet.
# FROM indique l'image utilisée pour créer notre image.
# Ici on utilise une image node et sa variante lts-alpine.

FROM node:20-alpine

# créer un répertoire de travail et s'y déplacer
WORKDIR /app

# on récupère le package.json depuis le dossier de build (./ => "server" => le "context" dans mon docker-compose)
COPY ./package.json /app

# on installe les dépendances
RUN npm i

# on copie le reste des fichiers de l'application
COPY . /app

# rendre utilisable le port de l'app
EXPOSE 3000

# Commande de démarrage
CMD npm run dev