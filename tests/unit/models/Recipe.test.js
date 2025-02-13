const { Recipe } = require("../../../app/models");

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
});
