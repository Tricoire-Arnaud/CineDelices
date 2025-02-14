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
    role: "admin",
  },
  movie: {
    titre: "Film Test",
    type: "film",
    description: "Description du film test",
    date_sortie: "2024-01-01",
    realisateur: "Réalisateur Test",
    duree: 120,
  },
  category: {
    libelle: "Catégorie Test",
  },
  ingredient: {
    nom_ingredient: "Ingrédient Test",
    unite_mesure: "g",
  },
  utensil: {
    nom_ustensile: "Ustensile Test",
  },
  recipe: {
    titre: "Recette Test",
    description: "Description de la recette test",
    anecdote: "Anecdote test",
    temps_preparation: 30,
    temps_cuisson: 45,
    difficulte: 3,
    statut: "en attente",
    etapes: ["Étape 1", "Étape 2"],
  },
};

describe("Tests du Contrôleur de Recettes", () => {
  let testUser;
  let testMovie;
  let testCategory;
  let testRecipe;
  let testIngredient;
  let testUtensil;
  let agent;
  let tempImagePath;

  // Avant chaque test, on prépare l'environnement
  beforeEach(async () => {
    try {
      // Création du dossier pour les uploads s'il n'existe pas
      const uploadDir = path.join(
        __dirname,
        "../../../public/images/uploads/recipes"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

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

      // Pour les tests qui nécessitent une recette validée, on la valide
      if (testRecipe) {
        await testRecipe.update({ statut: "validée" });
      }

      // Connexion de l'utilisateur test
      await agent.post("/auth/login").send({
        email: fixtures.user.email,
        mot_de_passe: fixtures.user.mot_de_passe,
      });

      // Création d'une image temporaire pour les tests
      tempImagePath = path.join(__dirname, "test-image.jpg");
      fs.writeFileSync(tempImagePath, "fake image content");
    } catch (error) {
      console.error("Erreur dans beforeEach:", error);
      throw error;
    }
  });

  // Après chaque test, on nettoie l'environnement
  afterEach(async () => {
    try {
      // Suppression de l'image temporaire
      if (fs.existsSync(tempImagePath)) {
        fs.unlinkSync(tempImagePath);
      }
    } catch (error) {
      console.error("Erreur dans afterEach:", error);
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
      const ingredients = [testIngredient.id_ingredient];
      const quantities = { [testIngredient.id_ingredient]: "100" };
      const utensils = [testUtensil.id_ustensile];

      const response = await agent
        .post("/mon-profil/proposition-recette")
        .field("titre", "New Test Recipe")
        .field("description", "Description test")
        .field("temps_preparation", "30")
        .field("temps_cuisson", "45")
        .field("difficulte", "3")
        .field("etapes", JSON.stringify(["Étape 1", "Étape 2"]))
        .field("anecdote", "Anecdote test")
        .field("id_categorie", testCategory.id_categorie)
        .field("id_oeuvre", testMovie.id_oeuvre)
        .field("ingredients", ingredients.join(","))
        .field("quantities", JSON.stringify(quantities))
        .field("utensils", utensils.join(","))
        .attach("image", tempImagePath);

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/mon-profil");

      // Vérification de la création en base de données
      const createdRecipe = await Recipe.findOne({
        where: { titre: "New Test Recipe" },
        include: [{ model: Ingredient }, { model: Utensil }],
      });
      expect(createdRecipe).toBeTruthy();
      expect(createdRecipe.statut).toBe("en attente");
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

  // Tests pour la suppression de recette
  describe("Suppression de recette (DELETE /admin/recipes/:id)", () => {
    it("devrait supprimer une recette existante", async () => {
      const response = await agent
        .post(`/admin/recipes/${testRecipe.id_recette}/delete`)
        .send();

      expect(response.status).toBe(302); // Redirection après suppression
      expect(response.headers.location).toBe("/admin/recette");

      // Vérifier que la recette a bien été supprimée
      const deletedRecipe = await Recipe.findByPk(testRecipe.id_recette);
      expect(deletedRecipe).toBeNull();
    });

    it("devrait retourner une erreur pour une recette inexistante", async () => {
      const response = await agent.post("/admin/recipes/99999/delete").send();

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/admin/recette");
    });
  });

  // Tests pour la validation de recette
  describe("Validation de recette (POST /admin/recettes/valider/:id)", () => {
    it("devrait valider une recette en attente", async () => {
      // Créer une nouvelle recette en attente
      const recipeToValidate = await Recipe.create({
        ...fixtures.recipe,
        etapes: JSON.stringify(fixtures.recipe.etapes),
        id_utilisateur: testUser.id_utilisateur,
        id_oeuvre: testMovie.id_oeuvre,
        id_categorie: testCategory.id_categorie,
      });

      // Vérifier que la recette est bien en attente
      expect(recipeToValidate.statut).toBe("en attente");

      // Valider la recette
      const response = await agent
        .post(`/admin/recettes/valider/${recipeToValidate.id_recette}`)
        .send();

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/admin/tableau-de-bord");

      // Vérifier que la recette a bien été validée
      const validatedRecipe = await Recipe.findByPk(
        recipeToValidate.id_recette
      );
      expect(validatedRecipe.statut).toBe("validée");
    });

    it("ne devrait pas valider une recette déjà validée", async () => {
      // Créer une recette déjà validée
      const validatedRecipe = await Recipe.create({
        ...fixtures.recipe,
        etapes: JSON.stringify(fixtures.recipe.etapes),
        id_utilisateur: testUser.id_utilisateur,
        id_oeuvre: testMovie.id_oeuvre,
        id_categorie: testCategory.id_categorie,
        statut: "validée",
      });

      // Tenter de valider la recette à nouveau
      const response = await agent
        .post(`/admin/recettes/valider/${validatedRecipe.id_recette}`)
        .send();

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/admin/tableau-de-bord");

      // Vérifier que le statut n'a pas changé
      const recipe = await Recipe.findByPk(validatedRecipe.id_recette);
      expect(recipe.statut).toBe("validée");
    });
  });
});
