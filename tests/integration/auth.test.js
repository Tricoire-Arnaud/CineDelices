const request = require("supertest"); // Importation de supertest pour les tests HTTP
const app = require("../../app"); // Importation de l'application Express
const { User } = require("../../app/models"); // Importation du modèle User
const bcrypt = require("bcrypt"); // Importation de bcrypt pour le hachage des mots de passe

// Tests des fonctionnalités d'authentification
describe("Auth Controller", () => {
  // Configuration initiale avant tous les tests
  beforeAll(async () => {
    // Création d'un utilisateur de test dans la base de données
    const hashedPassword = await bcrypt.hash("TestPassword123!", 10);
    await User.create({
      nom_utilisateur: "testuser",
      email: "test@test.com",
      mot_de_passe: hashedPassword,
      role: "user",
    });
  });

  // Nettoyage après tous les tests
  afterAll(async () => {
    // Suppression de l'utilisateur de test de la base de données
    await User.destroy({
      where: {
        email: "test@test.com",
      },
    });
  });

  // Tests spécifiques pour la route POST /auth/login
  describe("POST /auth/login", () => {
    // Test de connexion avec des identifiants valides
    it("should login with valid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@test.com",
        mot_de_passe: "TestPassword123!",
      });

      // Vérification que la connexion redirige vers la page d'accueil
      expect(response.status).toBe(302); // Code 302 = redirection
      expect(response.headers.location).toBe("/");
    });

    // Test de connexion avec des identifiants invalides
    it("should not login with invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@test.com",
        mot_de_passe: "wrongpassword",
      });

      // Vérification que l'échec de connexion redirige vers la page de login
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/auth/login");
    });
  });
});
