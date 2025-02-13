
## Procédure de mise en place de l'environnement de production

### 🛠 Prérequis

Avant de commencer, assurez-vous d'avoir :  
- **Docker** et **Docker Compose** installés.  
- Une connexion SSH au serveur.  
- Les accès à la base de données et aux secrets nécessaires.  

### 1. Cloner le projet

```sh
git clone <repository_url>
cd <nom_du_projet>
```

### 2. Copier et configurer le fichier d’environnement

```sh
cp .env.docker-compose.prod.example .env.docker-compose.prod
```

Ensuite, éditez `.env.docker-compose.prod` et renseignez les valeurs adaptées :  

- `DB_NAME`  
- `DB_USER`  
- `DB_PASSWORD`  
- `DB_HOST`  
- `PORT`  
- `JWT_SECRET`  
- Etc.

### 3. Construire et démarrer l'application en mode production

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

---

## 🚀 Déploiement d'une nouvelle version

Si vous devez mettre à jour l’application en production :  

```sh
git pull origin main
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Commandes utiles en production

### 📌 1. Démarrer l’environnement de production

```sh
docker compose -f docker-compose.prod.yml up -d
```
Lance les conteneurs en arrière-plan.

### 🛑 2. Arrêter l’environnement de production

```sh
docker compose -f docker-compose.prod.yml down
```

### 🔄 3. Mettre à jour l’application

Si des dépendances ou le code ont changé :  

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

### 🐚 4. Accéder au conteneur de l’application

```sh
docker exec -it cinedelices-app-prod bash
```

### 📦 5. Installer de nouvelles dépendances

Depuis le conteneur :  

```sh
npm install <package>
```

Depuis la machine hôte :  

```sh
docker exec -it cinedelices-app-prod npm install <package>
```

### 🗄️ 6. Mettre à jour la base de données

```sh
npm run init-db
```

Si nécessaire, pour réinitialiser la base avec des données de production :  

```sh
npm run reseed
```

### 📜 7. Consulter les logs des conteneurs

```sh
docker compose -f docker-compose.prod.yml logs -f cinedelices-app-prod
```

Ajoutez `--tail=100` pour voir uniquement les 100 dernières lignes.

### 📊 8. Surveiller les performances

Voir l’état des conteneurs :  

```sh
docker ps -a
docker stats
```

Nettoyer les anciennes images et conteneurs inutilisés :  

```sh
docker system prune -af
```

---

**_Avec ces commandes, vous pouvez gérer efficacement l’application en production !_** 🚀
