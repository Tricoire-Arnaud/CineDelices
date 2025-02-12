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

// Fixtures pour les tests
const fixtures = {
  user: {
    nom_utilisateur: "testuser",
    email: "testrecipe@test.com",
    mot_de_passe: "TestPassword123!",
    role: "user",
  },
  movie: {
    titre: "Test Movie",
    type: "film",
    annee: 2024,
    description: "Test Description",
  },
  category: {
    libelle: "Test Category",
  },
  ingredient: {
    nom_ingredient: "Test Ingredient",
    unite_mesure: "g",
  },
  utensil: {
    nom_ustensile: "Test Utensil",
  },
  recipe: {
    titre: "Test Recipe",
    description: "Test Description",
    temps_preparation: 30,
    temps_cuisson: 45,
    difficulte: 3,
    etapes: ["Étape 1", "Étape 2"],
    statut: "validée",
  },
};

describe("Recipe Controller", () => {
  let testUser;
  let testMovie;
  let testCategory;
  let testRecipe;
  let testIngredient;
  let testUtensil;
  let agent;

  beforeEach(async () => {
    try {
      agent = request.agent(app);

      // Créer les données de test dans l'ordre correct
      testUser = await User.create({
        ...fixtures.user,
        mot_de_passe: await bcrypt.hash(fixtures.user.mot_de_passe, 10),
      });

      testMovie = await Movie.create(fixtures.movie);
      testCategory = await Category.create(fixtures.category);
      testIngredient = await Ingredient.create(fixtures.ingredient);
      testUtensil = await Utensil.create(fixtures.utensil);

      testRecipe = await Recipe.create({
        ...fixtures.recipe,
        etapes: JSON.stringify(fixtures.recipe.etapes),
        id_utilisateur: testUser.id_utilisateur,
        id_oeuvre: testMovie.id_oeuvre,
        id_categorie: testCategory.id_categorie,
      });

      // Connecter l'utilisateur
      await agent.post("/auth/login").send({
        email: fixtures.user.email,
        mot_de_passe: fixtures.user.mot_de_passe,
      });
    } catch (error) {
      console.error("Erreur dans beforeEach:", error);
      throw error;
    }
  });

  describe("GET /catalogue", () => {
    it("should return list of recipes", async () => {
      const response = await request(app).get("/catalogue");
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
    });

    it("should include recipe details", async () => {
      const response = await request(app).get("/catalogue");
      expect(response.status).toBe(200);
      expect(response.text).toContain(fixtures.recipe.titre);
    });
  });

  describe("GET /recette/:id", () => {
    it("should return a specific recipe", async () => {
      const response = await agent.get(`/recette/${testRecipe.id_recette}`);
      expect(response.status).toBe(200);
      expect(response.type).toMatch(/html/);
      expect(response.text).toContain(fixtures.recipe.titre);
    });

    it("should return 404 for non-existent recipe", async () => {
      const response = await agent.get("/recette/99999");
      expect(response.status).toBe(404);
    });
  });

  describe("POST /mon-profil/proposition-recette", () => {
    it("should create a new recipe when authenticated", async () => {
      // Créer un fichier image temporaire pour le test
      const tempImagePath = path.join(__dirname, "test-image.jpg");
      fs.writeFileSync(tempImagePath, "fake image content");

      // Préparer les données des ingrédients et ustensiles
      const ingredients = [testIngredient.id_ingredient];
      const quantities = { [testIngredient.id_ingredient]: "100" };
      const utensils = [testUtensil.id_ustensile];

      const response = await agent
        .post("/mon-profil/proposition-recette")
        .field("titre", "New Test Recipe")
        .field("description", "Test Description")
        .field("temps_preparation", "30")
        .field("temps_cuisson", "45")
        .field("difficulte", "3")
        .field("etapes", JSON.stringify(["Étape 1", "Étape 2"]))
        .field("id_oeuvre", testMovie.id_oeuvre)
        .field("id_categorie", testCategory.id_categorie)
        .field("ingredients[]", ingredients)
        .field("quantities", JSON.stringify(quantities))
        .field("utensils[]", utensils)
        .attach("image", tempImagePath);

      // Nettoyer le fichier temporaire
      fs.unlinkSync(tempImagePath);

      expect(response.status).toBe(302); // Redirection après création
      expect(response.headers.location).toBe("/mon-profil");

      // Vérifier que la recette a été créée
      const createdRecipe = await Recipe.findOne({
        where: { titre: "New Test Recipe" },
        include: [{ model: Ingredient }, { model: Utensil }],
      });
      expect(createdRecipe).toBeTruthy();
      expect(createdRecipe.Ingredients).toHaveLength(1);
      expect(createdRecipe.Utensils).toHaveLength(1);
    });

    it("should not create recipe when not authenticated", async () => {
      const response = await request(app)
        .post("/mon-profil/proposition-recette")
        .send(fixtures.recipe);

      expect(response.status).toBe(302);
      expect(response.headers.location).toMatch(/\/auth\/login/);
    });
  });
});
