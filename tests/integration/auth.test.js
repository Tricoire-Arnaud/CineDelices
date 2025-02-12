const request = require("supertest");
const app = require("../../app");
const { User } = require("../../app/models");
const bcrypt = require("bcrypt");

describe("Auth Controller", () => {
  beforeAll(async () => {
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash("TestPassword123!", 10);
    await User.create({
      nom_utilisateur: "testuser",
      email: "test@test.com",
      mot_de_passe: hashedPassword,
      role: "user",
    });
  });

  afterAll(async () => {
    // Nettoyer la base de données après les tests
    await User.destroy({
      where: {
        email: "test@test.com",
      },
    });
  });

  describe("POST /auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@test.com",
        mot_de_passe: "TestPassword123!",
      });

      expect(response.status).toBe(302); // Redirection après connexion réussie
      expect(response.headers.location).toBe("/");
    });

    it("should not login with invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@test.com",
        mot_de_passe: "wrongpassword",
      });

      expect(response.status).toBe(302); // Redirection vers la page de login
      expect(response.headers.location).toBe("/auth/login");
    });
  });
});
