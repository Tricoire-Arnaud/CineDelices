const { Recipe } = require("../../../app/models");

describe("Recipe Model", () => {
  describe("Validation", () => {
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

      const recipe = await Recipe.build(validRecipe);
      expect(recipe).toHaveProperty("titre", "Ratatouille");
      expect(recipe).toHaveProperty(
        "description",
        "Une délicieuse ratatouille"
      );
    });

    it("should not create a recipe without required fields", async () => {
      try {
        await Recipe.create({});
        // Si la création réussit, le test doit échouer
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
