
## Procédure de mise en place de l'environnement de développement

### 1. Cloner le projet

### 2. Copier le fichier `.env.docker-compose.dev.example` et **modifier le en** `.env.docker-compose.dev`

### 3. Mettre les bonnes informations dans le fichier

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `PORT`
- `JWT_SECRET`
- Etc...

### 4. Lancer la commande

```sh
docker compose -f docker-compose.dev.yml up --build
```

---

## Commandes utiles en développement

Voici une liste de commandes courantes pour interagir avec l'application, déboguer, gérer les dépendances et la base de données :

### 🚀 1. Démarrer l’environnement de développement

```sh
docker compose -f docker-compose.dev.yml up -d
```
Lance les conteneurs en arrière-plan.

### 🛑 2. Arrêter l’environnement de développement

```sh
docker compose -f docker-compose.dev.yml down
```

### 🔄 3. Recréer l’environnement après des modifications

Si des dépendances ou le Dockerfile ont changé :

```sh
docker compose -f docker-compose.dev.yml up --build -d
```
Reconstruit les images avant de démarrer.

### 🐚 4. Accéder au conteneur de l’application

```sh
docker exec -it cinedelices-app-dev bash
```
Ouvre un terminal interactif à l’intérieur du conteneur.

### 📦 5. Installer de nouvelles dépendances

Depuis le conteneur :

```sh
npm install <package>
```

Depuis la machine hôte :

```sh
docker exec -it cinedelices-app-dev npm install <package>
```

### 🚀 6. Démarrer le serveur en mode développement

Depuis le conteneur :

```sh
npm run dev
```
Utilise `nodemon` pour recharger automatiquement l’application.

### 🗄️ 7. Initialiser ou réinitialiser la base de données

```sh
npm run init-db
```

Si nécessaire, pour réinitialiser la base avec des données de test :

```sh
npm run reseed
```

### 🧪 8. Exécuter les tests

#### Jest (tests unitaires)
- En mode surveillance :

```sh
npm run test:watch
```

- Avec couverture de code :

```sh
npm run test:coverage
```

### 🎨 9. Gérer le CSS avec Tailwind

- Pour surveiller les changements en développement :

```sh
npm run dev:css
```

- Pour générer le CSS optimisé en production :

```sh
npm run build:css
```

### ✅ 10. Vérifier le format et le linting du code

```sh
npm run format
npm run lint
```

### 📜 11. Consulter les logs des conteneurs

```sh
docker compose -f docker-compose.dev logs -f cinedelices-app-dev
```
Ajoute `--tail=100` pour voir uniquement les 100 dernières lignes.

---

**_Avec ces commandes, vous, les développeurs, pourrez travailler efficacement dans l’environnement Docker de développement !_** 🚀
