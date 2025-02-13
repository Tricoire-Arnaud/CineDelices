// Import des dépendances nécessaires
const request = require("supertest");
const app = require("../../../app");
const {
  Recipe,
  User,
  Movie,
  Category,
  Ingredient,
  Utensil,
} = require("../../../app/models");
const bcrypt = require("bcrypt");
const path = require("node:path");
const fs = require("node:fs");

// Définition des données de test (fixtures)
const fixtures = {
  user: {
    nom_utilisateur: "testuser",
    email: "testrecipe@test.com",
    mot_de_passe: "TestPassword123!",
    role: "user",
  },
  // ... autres fixtures ...
};

describe("Tests du Contrôleur de Recettes", () => {
  // Déclaration des variables de test
  let testUser;
  let testMovie;
  let testCategory;
  let testRecipe;
  let testIngredient;
  let testUtensil;
  let agent;

  // Avant chaque test, on prépare l'environnement
  beforeEach(async () => {
    try {
      // Création d'un agent pour gérer les sessions
      agent = request.agent(app);

      // Création des données de test dans la base de données
      testUser = await User.create({
        ...fixtures.user,
        mot_de_passe: await bcrypt.hash(fixtures.user.mot_de_passe, 10),
      });

      // Création des autres données nécessaires
      testMovie = await Movie.create(fixtures.movie);
      testCategory = await Category.create(fixtures.category);
      testIngredient = await Ingredient.create(fixtures.ingredient);
      testUtensil = await Utensil.create(fixtures.utensil);

      // Création d'une recette de test
      testRecipe = await Recipe.create({
        ...fixtures.recipe,
        etapes: JSON.stringify(fixtures.recipe.etapes),
        id_utilisateur: testUser.id_utilisateur,
        id_oeuvre: testMovie.id_oeuvre,
        id_categorie: testCategory.id_categorie,
      });

      // Connexion de l'utilisateur test
      await agent.post("/auth/login").send({
        email: fixtures.user.email,
        mot_de_passe: fixtures.user.mot_de_passe,
      });
    } catch (error) {
      console.error("Erreur dans beforeEach:", error);
      throw error;
    }
  });

  // Tests pour la route GET /catalogue
  describe("Liste des recettes (GET /catalogue)", () => {
    // Vérifie que la page du catalogue s'affiche correctement
    it("devrait retourner la liste des recettes", async () => {
      const response = await request(app).get("/catalogue");
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });

    // Vérifie que les détails des recettes sont inclus
    it("devrait inclure les détails des recettes", async () => {
      const response = await request(app).get("/catalogue");
      expect(response.status).toBe(200);
      expect(response.text).toContain(fixtures.recipe.titre);
    });
  });

  // Tests pour la route GET /recette/:id
  describe("Détail d'une recette (GET /recette/:id)", () => {
    // Vérifie qu'une recette spécifique s'affiche correctement
    it("devrait retourner une recette spécifique", async () => {
      const response = await agent.get(`/recette/${testRecipe.id_recette}`);
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
      expect(response.text).toContain(fixtures.recipe.titre);
    });

    // Vérifie le comportement pour une recette inexistante
    it("devrait retourner 404 pour une recette inexistante", async () => {
      const response = await agent.get("/recette/99999");
      expect(response.status).toBe(404);
    });
  });

  // Tests pour la création de recette
  describe("Création de recette (POST /mon-profil/proposition-recette)", () => {
    // Test de création d'une recette avec un utilisateur authentifié
    it("devrait créer une nouvelle recette quand l'utilisateur est authentifié", async () => {
      // Création d'une image temporaire pour le test
      const tempImagePath = path.join(__dirname, "test-image.jpg");
      fs.writeFileSync(tempImagePath, "fake image content");

      // Préparation des données du formulaire
      const ingredients = [testIngredient.id_ingredient];
      const quantities = { [testIngredient.id_ingredient]: "100" };
      const utensils = [testUtensil.id_ustensile];

      // Envoi de la requête de création
      const response = await agent
        .post("/mon-profil/proposition-recette")
        .field("titre", "New Test Recipe");
      // ... autres champs ...

      // Nettoyage du fichier temporaire
      fs.unlinkSync(tempImagePath);

      // Vérifications
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/mon-profil");

      // Vérification de la création en base de données
      const createdRecipe = await Recipe.findOne({
        where: { titre: "New Test Recipe" },
        include: [{ model: Ingredient }, { model: Utensil }],
      });
      expect(createdRecipe).toBeTruthy();
      expect(createdRecipe.Ingredients).toHaveLength(1);
      expect(createdRecipe.Utensils).toHaveLength(1);
    });

    // Test de création sans authentification
    it("ne devrait pas créer de recette sans authentification", async () => {
      const response = await request(app)
        .post("/mon-profil/proposition-recette")
        .send(fixtures.recipe);

      expect(response.status).toBe(302);
      expect(response.headers.location).toMatch(/\/auth\/login/);
    });
  });
});
