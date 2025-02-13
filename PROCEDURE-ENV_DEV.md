# Procédure de mise en place de l'environnement de dev

- cloner le projet depuis la branche "develop" `git clone --branch=develop <ssh_url>`
- copier le fichier `.env.docker-compose.example` en `.env.docker-compose`
- mettre les bonnes infos dans le fichier
- lancer `docker compose -f docker-compose.dev.yml up --build`