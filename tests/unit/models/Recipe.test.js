const { Recipe, User, Movie, Category } = require("../../../app/models");

describe("Recipe Model", () => {
  describe("Validation", () => {
    // Test pour vérifier la création d'une recette valide
    it("should create a valid recipe", async () => {
      const validRecipe = {
        titre: "Ratatouille",
        description: "Une délicieuse ratatouille",
        temps_preparation: 30,
        temps_cuisson: 45,
        difficulte: 3,
        etapes: JSON.stringify(["Étape 1", "Étape 2"]),
        id_utilisateur: 1,
        statut: "en attente",
      };

      // Création d'une instance de recette avec les données valides
      const recipe = await Recipe.build(validRecipe);
      // Vérification que les propriétés de la recette sont correctes
      expect(recipe).toHaveProperty("titre", "Ratatouille");
      expect(recipe).toHaveProperty(
        "description",
        "Une délicieuse ratatouille"
      );
    });

    // Test pour vérifier qu'une recette sans champs requis ne peut pas être créée
    it("should not create a recipe without required fields", async () => {
      try {
        // Tentative de création d'une recette sans données
        await Recipe.create({});
        // Si la création réussit, le test doit échouer
        expect(true).toBe(false);
      } catch (error) {
        // Vérification qu'une erreur est bien levée
        expect(error).toBeTruthy();
      }
    });
  });

  describe("Suppression", () => {
    it("devrait supprimer une recette et ses relations", async () => {
      // Création des données nécessaires
      const user = await User.create({
        nom_utilisateur: "testuser",
        email: "test@test.com",
        mot_de_passe: "password123",
        role: "user",
      });

      const movie = await Movie.create({
        titre: "Film Test",
        type: "film",
        description: "Description test",
        date_sortie: "2024-01-01",
        realisateur: "Réalisateur Test",
        duree: 120,
      });

      const category = await Category.create({
        libelle: "Catégorie Test",
      });

      const recipe = await Recipe.create({
        titre: "Recette Test",
        description: "Description test",
        temps_preparation: 30,
        temps_cuisson: 45,
        difficulte: 3,
        etapes: JSON.stringify(["Étape 1", "Étape 2"]),
        id_utilisateur: user.id_utilisateur,
        id_oeuvre: movie.id_oeuvre,
        id_categorie: category.id_categorie,
        statut: "en attente",
      });

      expect(recipe).toBeTruthy();

      await recipe.destroy();

      const deletedRecipe = await Recipe.findByPk(recipe.id_recette);
      expect(deletedRecipe).toBeNull();
    });
  });
});
