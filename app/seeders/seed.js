const {
  User,
  Movie,
  Category,
  Recipe,
  Ingredient,
  Utensil,
  RecipeIngredient,
  RecipeUtensil,
  Comment,
  Rating,
  Favorite,
} = require("../models");

const bcrypt = require("bcrypt");

async function seedDatabase() {
  try {
    // Création des utilisateurs
    const users = await User.bulkCreate([
      {
        nom_utilisateur: "admin",
        email: "admin@cinedelices.fr",
        mot_de_passe: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        nom_utilisateur: "chef_ratatouille",
        email: "chef@cinedelices.fr",
        mot_de_passe: await bcrypt.hash("chef123", 10),
        role: "utilisateur",
      },
      {
        nom_utilisateur: "hobbit_gourmet",
        email: "hobbit@cinedelices.fr",
        mot_de_passe: await bcrypt.hash("hobbit123", 10),
        role: "utilisateur",
      },
      {
        nom_utilisateur: "foodie_expert",
        email: "expert@cinedelices.fr",
        mot_de_passe: await bcrypt.hash("expert123", 10),
        role: "utilisateur",
      },
      {
        nom_utilisateur: "gourmet_master",
        email: "master@cinedelices.fr",
        mot_de_passe: await bcrypt.hash("master123", 10),
        role: "utilisateur",
      },
    ]);

    // Création des catégories
    const categories = await Category.bulkCreate([
      { libelle: "Entrée" },
      { libelle: "Plat principal" },
      { libelle: "Dessert" },
      { libelle: "Boisson" },
      { libelle: "Snack" },
      { libelle: "Apéritif" },
    ]);

    // Création des œuvres (films, séries et documentaires)
    const movies = await Movie.bulkCreate([
      {
        titre: "Ratatouille",
        type: "film",
        annee: 2007,
        description: "Un rat qui rêve de devenir chef cuisinier à Paris",
      },
      {
        titre: "Le Seigneur des Anneaux",
        type: "film",
        annee: 2001,
        description: "L'épopée fantastique de la Terre du Milieu",
      },
      {
        titre: "Harry Potter",
        type: "film",
        annee: 2001,
        description: "Les aventures du célèbre sorcier",
      },
      {
        titre: "Chef",
        type: "film",
        annee: 2014,
        description: "Un chef qui redécouvre sa passion pour la cuisine",
      },
      {
        titre: "Game of Thrones",
        type: "série",
        annee: 2011,
        description: "Une saga médiévale-fantastique épique",
      },
      {
        titre: "Breaking Bad",
        type: "série",
        annee: 2008,
        description: "L'histoire d'un professeur de chimie devenu criminel",
      },
      {
        titre: "Les Simpsons",
        type: "série",
        annee: 1989,
        description: "Les aventures d'une famille américaine déjantée",
      },
      {
        titre: "Julie et Julia",
        type: "film",
        annee: 2009,
        description:
          "L'histoire parallèle de Julia Child et d'une blogueuse culinaire",
      },
      {
        titre: "Le Grand Restaurant",
        type: "film",
        annee: 1966,
        description:
          "Les aventures de Monsieur Septime dans son restaurant gastronomique",
      },
      {
        titre: "Chocolat",
        type: "film",
        annee: 2000,
        description:
          "L'histoire d'une chocolatière qui bouleverse une petite ville française",
      },
      {
        titre: "The Bear",
        type: "série",
        annee: 2022,
        description:
          "Un jeune chef étoilé reprend le restaurant familial de sandwichs à Chicago",
      },
      {
        titre: "Downton Abbey",
        type: "série",
        annee: 2010,
        description:
          "La vie d'une famille aristocratique anglaise et de leurs domestiques",
      },
      {
        titre: "Babette's Feast",
        type: "film",
        annee: 1987,
        description:
          "Une réfugiée française prépare un festin somptueux pour un village danois",
      },
    ]);

    // Création des ingrédients de base
    const ingredients = await Ingredient.bulkCreate([
      { nom_ingredient: "Tomate", unite_mesure: "g" },
      { nom_ingredient: "Aubergine", unite_mesure: "g" },
      { nom_ingredient: "Courgette", unite_mesure: "g" },
      { nom_ingredient: "Poivron rouge", unite_mesure: "pièce" },
      { nom_ingredient: "Oignon jaune", unite_mesure: "pièce" },
      { nom_ingredient: "Ail", unite_mesure: "gousse" },
      { nom_ingredient: "Huile d'olive", unite_mesure: "cuillère à soupe" },
      { nom_ingredient: "Beurre salé", unite_mesure: "g" },
      { nom_ingredient: "Farine T55", unite_mesure: "g" },
      { nom_ingredient: "Lait entier", unite_mesure: "ml" },
      { nom_ingredient: "Champignons de Paris", unite_mesure: "g" },
      { nom_ingredient: "Pommes de terre", unite_mesure: "g" },
      { nom_ingredient: "Bière blonde", unite_mesure: "ml" },
      { nom_ingredient: "Cuisse de poulet", unite_mesure: "g" },
      { nom_ingredient: "Citron jaune", unite_mesure: "pièce" },
      { nom_ingredient: "Chocolat noir 70%", unite_mesure: "g" },
      { nom_ingredient: "Sucre en poudre", unite_mesure: "g" },
      { nom_ingredient: "Crème fraîche", unite_mesure: "ml" },
      { nom_ingredient: "Pain de mie", unite_mesure: "tranche" },
      { nom_ingredient: "Lardons fumés", unite_mesure: "g" },
      { nom_ingredient: "Œufs", unite_mesure: "pièce" },
      { nom_ingredient: "Comté", unite_mesure: "g" },
      { nom_ingredient: "Thym", unite_mesure: "pincée" },
      { nom_ingredient: "Laurel", unite_mesure: "feuille" },
      { nom_ingredient: "Miel", unite_mesure: "cuillère à café" },
      {
        nom_ingredient: "Vinaigre balsamique",
        unite_mesure: "cuillère à soupe",
      },
      { nom_ingredient: "Riz Arborio", unite_mesure: "g" },
      { nom_ingredient: "Bouillon de volaille", unite_mesure: "ml" },
      { nom_ingredient: "Parmesan", unite_mesure: "g" },
    ]);

    // Ustensiles plus complets
    const ustensils = await Utensil.bulkCreate([
      { nom_ustensile: "Couteau de chef" },
      { nom_ustensile: "Planche à découper" },
      { nom_ustensile: "Casserole" },
      { nom_ustensile: "Poêle antiadhésive" },
      { nom_ustensile: "Fouet" },
      { nom_ustensile: "Spatule" },
      { nom_ustensile: "Mandoline" },
      { nom_ustensile: "Mixeur plongeant" },
      { nom_ustensile: "Four" },
      { nom_ustensile: "Plat de cuisson" },
      { nom_ustensile: "Cuillère en bois" },
      { nom_ustensile: "Moule à tarte" },
    ]);

    // Création des recettes existantes
    const recipes = await Recipe.bulkCreate([
      {
        titre: "Ratatouille Confite",
        description:
          "Version réaliste de la ratatouille du film, inspirée de la ratatouille niçoise",
        etapes: JSON.stringify([
          "Préchauffer le four à 150°C (thermostat 5).",
          "Couper 2 aubergines, 3 courgettes et 4 tomates en rondelles de 3mm d'épaisseur.",
          "Dans un plat allant au four, alterner les légumes en spirale serrée.",
          "Ajouter 4 gousses d'ail émincées, 5 cuillères à soupe d'huile d'olive, sel et thym.",
          "Couvrir de papier cuisson et cuire 2 heures en arrosant régulièrement.",
          "Retirer le papier et poursuivre la cuisson 30 min à 180°C pour dorer.",
        ]),
        temps_preparation: 40,
        temps_cuisson: 150,
        difficulte: 3,
        anecdote:
          "La véritable ratatouille niçoise est une mijotée de légumes, le film a popularisé cette version en spirale",
        image: "ratatouille-reelle.jpg",
        id_oeuvre: movies[0].id,
        id_categorie: categories[1].id,
      },
      {
        titre: "Second petit-déjeuner de Hobbit Complet",
        description:
          "Repas copieux inspiré des habitudes alimentaires des Hobbits",
        etapes: JSON.stringify([
          "Faire sauter 300g de champignons à l'ail et persil",
          "Cuire 500g de pommes de terre en cubes à la poêle",
          "Griller 200g de lardons et 4 tranches de pain de campagne",
          "Préparer des œufs au plat",
          "Servir tous les éléments accompagnés de fromage râpé",
        ]),
        temps_preparation: 30,
        temps_cuisson: 25,
        difficulte: 2,
        image: "hobbit-breakfast.jpg",
        id_oeuvre: movies[1].id,
        id_categorie: categories[0].id,
      },
      {
        titre: "Bière au Beurre Authentique",
        description: "Version alcool-free inspirée des livres Harry Potter",
        etapes: JSON.stringify([
          "Faire fondre 50g de beurre dans une casserole.",
          "Ajouter 50g de sucre roux et 2 cuillères à café de caramel liquide.",
          "Verser 500ml de bière sans alcool et 250ml de lait d'amande.",
          "Porter à frémissement en remuant constamment.",
          "Servir chaud avec de la crème fouettée et de la noix de muscade.",
        ]),
        temps_preparation: 10,
        temps_cuisson: 15,
        difficulte: 1,
        anecdote:
          "Les studios Harry Potter proposent une version non alcoolisée dans leurs parcs à thème",
        image: "butterbeer_real.jpg",
        id_oeuvre: movies[2].id,
        id_categorie: categories[3].id,
      },
      {
        titre: "Tourte au Poulet façon Mrs Weasley",
        description: "Recette réconfortante inspirée des romans Harry Potter",
        etapes: JSON.stringify([
          "Faire revenir 500g de poulet en morceaux avec 1 oignon émincé.",
          "Ajouter 200g de champignons et 2 carottes en dés. Cuire 10 min.",
          "Mélanger avec 200ml de crème fraîche et 1 cuillère à café de moutarde.",
          "Étaler une pâte brisée dans un moule, verser la préparation.",
          "Recouvrir d'une seconde pâte, sceller les bords et faire des entailles.",
          "Cuire 40 min à 180°C jusqu'à coloration.",
        ]),
        temps_preparation: 35,
        temps_cuisson: 45,
        difficulte: 2,
        anecdote:
          "Les tourtes sont fréquentes dans la cuisine britannique traditionnelle",
        image: "chicken_pie_real.jpg",
        id_oeuvre: movies[2].id,
        id_categorie: categories[1].id,
      },
      {
        titre: "Pain Elfique Lembas",
        description:
          "Un pain nourrissant et légèrement sucré, idéal pour les aventuriers.",
        etapes: JSON.stringify([
          "Mélanger farine, beurre, miel et lait jusqu'à obtenir une pâte homogène.",
          "Façonner des galettes épaisses et marquer d'un motif en croix.",
          "Cuire au four à 180°C pendant 25 minutes.",
          "Laisser refroidir avant d'envelopper dans des feuilles de vigne.",
        ]),
        temps_preparation: 20,
        temps_cuisson: 25,
        difficulte: 2,
        anecdote:
          "Une seule bouchée suffit à rassasier un homme pour toute une journée !",
        image: "lembas.jpg",
        id_oeuvre: movies[1].id,
        id_categorie: categories[3].id,
      },
      {
        titre: "Festin de Winterfell",
        description: "Un copieux ragoût du Nord",
        etapes: JSON.stringify([
          "Préparer la viande",
          "Faire revenir les légumes",
          "Mijoter longuement",
          "Servir bien chaud",
        ]),
        temps_preparation: 45,
        temps_cuisson: 180,
        difficulte: 3,
        anecdote: "Un plat typique du Nord, servi aux Stark et leurs invités.",
        image: "winterfell-stew.jpg",
        id_oeuvre: movies[4].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Donuts de Homer Simpson",
        description: "Version améliorée des donuts roses des Simpsons",
        etapes: JSON.stringify([
          "Mélanger 500g de farine, 50g de sucre, 1 sachet de levure.",
          "Ajouter 2 œufs, 100ml de lait tiède et 50g de beurre fondu.",
          "Pétrir 10 min et laisser lever 1h.",
          "Former des donuts et frire à 170°C 2 min par côté.",
          "Glaçage : mélanger 200g de sucre glace, colorant rose et 3 c.à.s d'eau.",
        ]),
        temps_preparation: 90,
        temps_cuisson: 15,
        difficulte: 3,
        anecdote:
          "Le magasin de donuts préféré d'Homer s'appelle Lard Lad Donuts",
        image: "simpsons_donuts_real.jpg",
        id_oeuvre: movies[6].id,
        id_categorie: categories[2].id,
      },
      {
        titre: "Bœuf Bourguignon de Julia Child",
        description: "Recette authentique du célèbre chef français",
        etapes: JSON.stringify([
          "Saisir 1kg de paleron de bœuf dans 3 cuillères d'huile.",
          "Ajouter 2 oignons et 200g de lardons. Faire colorer.",
          "Saupoudrer de 2 cuillères à soupe de farine. Mélanger.",
          "Mouiller avec 750ml de vin rouge et 250ml de bouillon.",
          "Ajouter 4 carottes, 1 bouquet garni. Cuire 3h à feu doux.",
          "Ajouter 200g de champignons en fin de cuisson.",
        ]),
        temps_preparation: 45,
        temps_cuisson: 210,
        difficulte: 4,
        anecdote:
          "Julia Child a adapté cette recette pour le public américain dans son livre 'Mastering the Art of French Cooking'",
        image: "boeuf_bourguignon_real.jpg",
        id_oeuvre: movies[7].id,
        id_categorie: categories[1].id,
      },
      {
        titre: "Sushi à la Jiro",
        description:
          "Une interprétation inspirée du documentaire pour les amateurs de sushi",
        etapes: JSON.stringify([
          "Préparer le riz à sushi",
          "Assaisonner avec vinaigre et miel",
          "Découper le poisson frais",
          "Assembler les sushis avec soin",
        ]),
        temps_preparation: 50,
        temps_cuisson: 20,
        difficulte: 5,
        anecdote: "Inspiré par Jiro, ce sushi demande précision et passion.",
        image: "jiro-sushi.jpg",
        id_oeuvre: movies[8].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Sole Meunière de Septime",
        description: "La spécialité du Grand Restaurant",
        etapes: JSON.stringify([
          "Préparer la sole",
          "Faire fondre le beurre",
          "Cuire la sole",
          "Préparer la sauce au citron",
        ]),
        temps_preparation: 20,
        temps_cuisson: 15,
        difficulte: 4,
        anecdote:
          "Le plat signature de M. Septime, servi avec une maladresse légendaire !",
        image: "sole-meuniere.jpg",
        id_oeuvre: movies[8].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Canard à l'orange façon Septime",
        description: "Un classique de la cuisine française revisité",
        etapes: JSON.stringify([
          "Préparer le canard",
          "Faire la sauce à l'orange",
          "Rôtir le canard",
          "Napper de sauce",
        ]),
        temps_preparation: 40,
        temps_cuisson: 60,
        difficulte: 4,
        anecdote: "Le plat qui a failli être servi au président !",
        image: "canard-orange.jpg",
        id_oeuvre: movies[9].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Chocolat chaud épicé de Vianne",
        description: "Le chocolat chaud qui réchauffe les cœurs",
        etapes: JSON.stringify([
          "Faire fondre le chocolat",
          "Ajouter les épices",
          "Incorporer le lait chaud",
          "Mélanger jusqu'à onctuosité",
        ]),
        temps_preparation: 15,
        temps_cuisson: 10,
        difficulte: 2,
        anecdote: "La recette secrète qui a transformé tout un village",
        image: "chocolat-epice.jpg",
        id_oeuvre: movies[9].id_oeuvre,
        id_categorie: categories[3].id_categorie,
      },
      {
        titre: "Truffes au chocolat maya",
        description: "Truffes au chocolat avec une touche d'épices anciennes",
        etapes: JSON.stringify([
          "Préparer la ganache",
          "Incorporer les épices",
          "Former les truffes",
          "Rouler dans le cacao",
        ]),
        temps_preparation: 30,
        temps_cuisson: 0,
        difficulte: 3,
        anecdote: "Inspirées des recettes ancestrales mayas",
        image: "truffes-maya.jpg",
        id_oeuvre: movies[9].id_oeuvre,
        id_categorie: categories[2].id_categorie,
      },
      {
        titre: "Italian Beef Sandwich",
        description: "Le sandwich signature du Original Beef of Chicagoland",
        etapes: JSON.stringify([
          "Préparer le rôti de bœuf",
          "Faire le jus (au jus)",
          "Préparer les piments",
          "Assembler le sandwich",
        ]),
        temps_preparation: 30,
        temps_cuisson: 240,
        difficulte: 3,
        anecdote: "La recette qui a fait la réputation du restaurant",
        image: "italian-beef.jpg",
        id_oeuvre: movies[10].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Risotto aux champignons de Carmy",
        description: "Un risotto parfaitement crémeux",
        etapes: JSON.stringify([
          "Préparer le bouillon",
          "Faire revenir le riz",
          "Incorporer le bouillon progressivement",
          "Ajouter les champignons",
        ]),
        temps_preparation: 20,
        temps_cuisson: 25,
        difficulte: 4,
        anecdote: "La recette qui rappelle ses années en cuisine gastronomique",
        image: "risotto.jpg",
        id_oeuvre: movies[10].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Pudding de Noël de Mrs Patmore",
        description: "Le dessert traditionnel de Downton Abbey",
        etapes: JSON.stringify([
          "Préparer les fruits secs",
          "Mélanger les ingrédients",
          "Cuire à la vapeur",
          "Flamber au cognac",
        ]),
        temps_preparation: 45,
        temps_cuisson: 180,
        difficulte: 4,
        anecdote: "Servi chaque année au dîner de Noël de Downton",
        image: "christmas-pudding.jpg",
        id_oeuvre: movies[11].id_oeuvre,
        id_categorie: categories[2].id_categorie,
      },
      {
        titre: "Tarte aux pommes à l'anglaise",
        description: "Une tarte traditionnelle servie à l'heure du thé",
        etapes: JSON.stringify([
          "Préparer la pâte",
          "Couper les pommes",
          "Assembler la tarte",
          "Cuire au four",
        ]),
        temps_preparation: 30,
        temps_cuisson: 45,
        difficulte: 3,
        anecdote: "La recette préférée de la Comtesse douairière",
        image: "apple-pie.jpg",
        id_oeuvre: movies[11].id_oeuvre,
        id_categorie: categories[2].id_categorie,
      },
      {
        titre: "Cailles en Sarcophage",
        description: "Le plat principal du festin de Babette",
        etapes: JSON.stringify([
          "Préparer les cailles",
          "Faire la farce",
          "Assembler en croûte",
          "Cuire au four",
        ]),
        temps_preparation: 90,
        temps_cuisson: 45,
        difficulte: 5,
        anecdote:
          "Le plat qui a transformé un simple dîner en expérience transcendante",
        image: "cailles.jpg",
        id_oeuvre: movies[12].id_oeuvre,
        id_categorie: categories[1].id_categorie,
      },
      {
        titre: "Soupe de tortue à la française",
        description: "Une soupe raffinée et complexe",
        etapes: JSON.stringify([
          "Préparer le bouillon",
          "Cuire les légumes",
          "Incorporer les herbes",
          "Mijoter longuement",
        ]),
        temps_preparation: 60,
        temps_cuisson: 180,
        difficulte: 5,
        anecdote: "Un des plats emblématiques du festin de Babette",
        image: "turtle-soup.jpg",
        id_oeuvre: movies[12].id_oeuvre,
        id_categorie: categories[0].id_categorie,
      },
    ]);

    // Associations recettes-ingrédients
    await RecipeIngredient.bulkCreate([
      // Ingrédients pour la Ratatouille Confite
      {
        id_recette: recipes[0].id_recette,
        id_ingredient: ingredients[0].id_ingredient,
        quantite: "4",
      }, // Tomates
      {
        id_recette: recipes[0].id_recette,
        id_ingredient: ingredients[1].id_ingredient,
        quantite: "2",
      }, // Aubergines
      {
        id_recette: recipes[0].id_recette,
        id_ingredient: ingredients[2].id_ingredient,
        quantite: "3",
      }, // Courgettes
      {
        id_recette: recipes[0].id_recette,
        id_ingredient: ingredients[5].id_ingredient,
        quantite: "4",
      }, // Gousses d'ail
      {
        id_recette: recipes[0].id_recette,
        id_ingredient: ingredients[6].id_ingredient,
        quantite: "5",
      }, // Huile d'olive
      {
        id_recette: recipes[0].id_recette,
        id_ingredient: ingredients[22].id_ingredient,
        quantite: "2",
      }, // Thym

      // Ingrédients pour le Second petit-déjeuner hobbit
      {
        id_recette: recipes[1].id_recette,
        id_ingredient: ingredients[10].id_ingredient,
        quantite: "300",
      }, // Champignons
      {
        id_recette: recipes[1].id_recette,
        id_ingredient: ingredients[11].id_ingredient,
        quantite: "500",
      }, // Pommes de terre
      {
        id_recette: recipes[1].id_recette,
        id_ingredient: ingredients[19].id_ingredient,
        quantite: "200",
      }, // Lardons
      {
        id_recette: recipes[1].id_recette,
        id_ingredient: ingredients[20].id_ingredient,
        quantite: "4",
      }, // Œufs
      {
        id_recette: recipes[1].id_recette,
        id_ingredient: ingredients[22].id_ingredient,
        quantite: "1",
      }, // Thym

      // Ingrédients pour la Bière au Beurre
      {
        id_recette: recipes[2].id_recette,
        id_ingredient: ingredients[7].id_ingredient,
        quantite: "100",
      }, // Beurre
      {
        id_recette: recipes[2].id_recette,
        id_ingredient: ingredients[12].id_ingredient,
        quantite: "500",
      }, // Bière
      {
        id_recette: recipes[2].id_recette,
        id_ingredient: ingredients[16].id_ingredient,
        quantite: "100",
      }, // Sucre
      {
        id_recette: recipes[2].id_recette,
        id_ingredient: ingredients[17].id_ingredient,
        quantite: "200",
      }, // Crème fraîche
      {
        id_recette: recipes[2].id_recette,
        id_ingredient: ingredients[24].id_ingredient,
        quantite: "2",
      }, // Miel

      // Ingrédients pour les Donuts d'Homer
      {
        id_recette: recipes[3].id_recette,
        id_ingredient: ingredients[8].id_ingredient,
        quantite: "500",
      }, // Farine
      {
        id_recette: recipes[3].id_recette,
        id_ingredient: ingredients[16].id_ingredient,
        quantite: "100",
      }, // Sucre
      {
        id_recette: recipes[3].id_recette,
        id_ingredient: ingredients[20].id_ingredient,
        quantite: "2",
      }, // Œufs
      {
        id_recette: recipes[3].id_recette,
        id_ingredient: ingredients[9].id_ingredient,
        quantite: "250",
      }, // Lait
      {
        id_recette: recipes[3].id_recette,
        id_ingredient: ingredients[7].id_ingredient,
        quantite: "50",
      }, // Beurre

      // Ingrédients pour le Bœuf Bourguignon
      {
        id_recette: recipes[4].id_recette,
        id_ingredient: ingredients[4].id_ingredient,
        quantite: "3",
      }, // Oignons
      {
        id_recette: recipes[4].id_recette,
        id_ingredient: ingredients[5].id_ingredient,
        quantite: "4",
      }, // Ail
      {
        id_recette: recipes[4].id_recette,
        id_ingredient: ingredients[6].id_ingredient,
        quantite: "3",
      }, // Huile d'olive
      {
        id_recette: recipes[4].id_recette,
        id_ingredient: ingredients[19].id_ingredient,
        quantite: "200",
      }, // Lardons
      {
        id_recette: recipes[4].id_recette,
        id_ingredient: ingredients[23].id_ingredient,
        quantite: "2",
      }, // Laurier

      // Ingrédients pour la Tourte au Poulet
      {
        id_recette: recipes[5].id_recette,
        id_ingredient: ingredients[13].id_ingredient,
        quantite: "500",
      }, // Poulet
      {
        id_recette: recipes[5].id_recette,
        id_ingredient: ingredients[4].id_ingredient,
        quantite: "1",
      }, // Oignon
      {
        id_recette: recipes[5].id_recette,
        id_ingredient: ingredients[10].id_ingredient,
        quantite: "200",
      }, // Champignons
      {
        id_recette: recipes[5].id_recette,
        id_ingredient: ingredients[17].id_ingredient,
        quantite: "200",
      }, // Crème fraîche
      {
        id_recette: recipes[5].id_recette,
        id_ingredient: ingredients[8].id_ingredient,
        quantite: "300",
      }, // Farine

      // Ingrédients pour le Pain Elfique
      {
        id_recette: recipes[6].id_recette,
        id_ingredient: ingredients[8].id_ingredient,
        quantite: "400",
      }, // Farine
      {
        id_recette: recipes[6].id_recette,
        id_ingredient: ingredients[7].id_ingredient,
        quantite: "50",
      }, // Beurre
      {
        id_recette: recipes[6].id_recette,
        id_ingredient: ingredients[24].id_ingredient,
        quantite: "3",
      }, // Miel
      {
        id_recette: recipes[6].id_recette,
        id_ingredient: ingredients[9].id_ingredient,
        quantite: "200",
      }, // Lait

      // Ingrédients pour le Festin de Winterfell
      {
        id_recette: recipes[7].id_recette,
        id_ingredient: ingredients[13].id_ingredient,
        quantite: "800",
      }, // Poulet
      {
        id_recette: recipes[7].id_recette,
        id_ingredient: ingredients[19].id_ingredient,
        quantite: "200",
      }, // Lardons
      {
        id_recette: recipes[7].id_recette,
        id_ingredient: ingredients[11].id_ingredient,
        quantite: "400",
      }, // Pommes de terre
      {
        id_recette: recipes[7].id_recette,
        id_ingredient: ingredients[4].id_ingredient,
        quantite: "3",
      }, // Oignons
      {
        id_recette: recipes[7].id_recette,
        id_ingredient: ingredients[23].id_ingredient,
        quantite: "2",
      }, // Laurier

      // Ingrédients pour le Chocolat Chaud Épicé
      {
        id_recette: recipes[8].id_recette,
        id_ingredient: ingredients[15].id_ingredient,
        quantite: "200",
      }, // Chocolat noir
      {
        id_recette: recipes[8].id_recette,
        id_ingredient: ingredients[9].id_ingredient,
        quantite: "500",
      }, // Lait
      {
        id_recette: recipes[8].id_recette,
        id_ingredient: ingredients[17].id_ingredient,
        quantite: "100",
      }, // Crème
      {
        id_recette: recipes[8].id_recette,
        id_ingredient: ingredients[24].id_ingredient,
        quantite: "2",
      }, // Miel

      // Ingrédients pour le Risotto aux Champignons
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[26].id_ingredient,
        quantite: "300",
      }, // Riz Arborio
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[27].id_ingredient,
        quantite: "1000",
      }, // Bouillon
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[10].id_ingredient,
        quantite: "250",
      }, // Champignons
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[28].id_ingredient,
        quantite: "100",
      }, // Parmesan
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[7].id_ingredient,
        quantite: "50",
      }, // Beurre

      // Ingrédients pour le Pudding de Noël
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[8].id_ingredient,
        quantite: "300",
      }, // Farine
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[16].id_ingredient,
        quantite: "200",
      }, // Sucre
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[20].id_ingredient,
        quantite: "3",
      }, // Œufs
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[24].id_ingredient,
        quantite: "4",
      }, // Miel
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[17].id_ingredient,
        quantite: "200",
      }, // Crème

      // Ingrédients pour la Tarte aux pommes
      {
        id_recette: recipes[11].id_recette,
        id_ingredient: ingredients[8].id_ingredient,
        quantite: "250",
      }, // Farine
      {
        id_recette: recipes[11].id_recette,
        id_ingredient: ingredients[7].id_ingredient,
        quantite: "125",
      }, // Beurre
      {
        id_recette: recipes[11].id_recette,
        id_ingredient: ingredients[16].id_ingredient,
        quantite: "100",
      }, // Sucre
      {
        id_recette: recipes[11].id_recette,
        id_ingredient: ingredients[20].id_ingredient,
        quantite: "1",
      }, // Œuf
      {
        id_recette: recipes[11].id_recette,
        id_ingredient: ingredients[24].id_ingredient,
        quantite: "2",
      }, // Miel

      // Ingrédients pour les Cailles en Sarcophage
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[8].id_ingredient,
        quantite: "400",
      }, // Farine
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[7].id_ingredient,
        quantite: "200",
      }, // Beurre
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[20].id_ingredient,
        quantite: "2",
      }, // Œufs
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[17].id_ingredient,
        quantite: "200",
      }, // Crème
      {
        id_recette: recipes[9].id_recette,
        id_ingredient: ingredients[22].id_ingredient,
        quantite: "3",
      }, // Thym

      // Ingrédients pour la Soupe de tortue
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[27].id_ingredient,
        quantite: "1000",
      }, // Bouillon
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[4].id_ingredient,
        quantite: "2",
      }, // Oignons
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[5].id_ingredient,
        quantite: "3",
      }, // Ail
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[22].id_ingredient,
        quantite: "2",
      }, // Thym
      {
        id_recette: recipes[10].id_recette,
        id_ingredient: ingredients[23].id_ingredient,
        quantite: "1",
      }, // Laurier
    ]);

    // Associations recettes-ustensiles
    await RecipeUtensil.bulkCreate([
      // Ustensiles pour la Ratatouille
      {
        id_recette: recipes[0].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[0].id_recette,
        id_ustensile: ustensils[1].id_ustensile,
      }, // Planche
      {
        id_recette: recipes[0].id_recette,
        id_ustensile: ustensils[6].id_ustensile,
      }, // Mandoline
      {
        id_recette: recipes[0].id_recette,
        id_ustensile: ustensils[9].id_ustensile,
      }, // Plat

      // Ustensiles pour le petit-déjeuner hobbit
      {
        id_recette: recipes[1].id_recette,
        id_ustensile: ustensils[3].id_ustensile,
      }, // Poêle
      {
        id_recette: recipes[1].id_recette,
        id_ustensile: ustensils[5].id_ustensile,
      }, // Spatule
      {
        id_recette: recipes[1].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère

      // Ustensiles pour la Bièraubeurre
      {
        id_recette: recipes[2].id_recette,
        id_ustensile: ustensils[2].id_ustensile,
      }, // Casserole
      {
        id_recette: recipes[2].id_recette,
        id_ustensile: ustensils[4].id_ustensile,
      }, // Fouet
      {
        id_recette: recipes[2].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère

      // Ustensiles pour les Donuts
      {
        id_recette: recipes[3].id_recette,
        id_ustensile: ustensils[4].id_ustensile,
      }, // Fouet
      {
        id_recette: recipes[3].id_recette,
        id_ustensile: ustensils[8].id_ustensile,
      }, // Four
      {
        id_recette: recipes[3].id_recette,
        id_ustensile: ustensils[3].id_ustensile,
      }, // Poêle

      // Ustensiles pour le Bœuf Bourguignon
      {
        id_recette: recipes[4].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[4].id_recette,
        id_ustensile: ustensils[2].id_ustensile,
      }, // Casserole
      {
        id_recette: recipes[4].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère

      // Ustensiles pour la Tourte au Poulet
      {
        id_recette: recipes[5].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[5].id_recette,
        id_ustensile: ustensils[1].id_ustensile,
      }, // Planche
      {
        id_recette: recipes[5].id_recette,
        id_ustensile: ustensils[8].id_ustensile,
      }, // Four
      {
        id_recette: recipes[5].id_recette,
        id_ustensile: ustensils[11].id_ustensile,
      }, // Moule à tarte

      // Ustensiles pour le Pain Elfique
      {
        id_recette: recipes[6].id_recette,
        id_ustensile: ustensils[4].id_ustensile,
      }, // Fouet
      {
        id_recette: recipes[6].id_recette,
        id_ustensile: ustensils[8].id_ustensile,
      }, // Four
      {
        id_recette: recipes[6].id_recette,
        id_ustensile: ustensils[9].id_ustensile,
      }, // Plat de cuisson

      // Ustensiles pour le Festin de Winterfell
      {
        id_recette: recipes[7].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[7].id_recette,
        id_ustensile: ustensils[2].id_ustensile,
      }, // Casserole
      {
        id_recette: recipes[7].id_recette,
        id_ustensile: ustensils[9].id_ustensile,
      }, // Plat de cuisson
      {
        id_recette: recipes[7].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère en bois

      // Ustensiles pour le Chocolat Chaud Épicé
      {
        id_recette: recipes[8].id_recette,
        id_ustensile: ustensils[2].id_ustensile,
      }, // Casserole
      {
        id_recette: recipes[8].id_recette,
        id_ustensile: ustensils[4].id_ustensile,
      }, // Fouet
      {
        id_recette: recipes[8].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère

      // Ustensiles pour le Risotto
      {
        id_recette: recipes[9].id_recette,
        id_ustensile: ustensils[2].id_ustensile,
      }, // Casserole
      {
        id_recette: recipes[9].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère
      {
        id_recette: recipes[9].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau

      // Ustensiles pour le Pudding de Noël
      {
        id_recette: recipes[10].id_recette,
        id_ustensile: ustensils[4].id_ustensile,
      }, // Fouet
      {
        id_recette: recipes[10].id_recette,
        id_ustensile: ustensils[8].id_ustensile,
      }, // Four
      {
        id_recette: recipes[10].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère

      // Ustensiles pour la Tarte aux pommes
      {
        id_recette: recipes[11].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[11].id_recette,
        id_ustensile: ustensils[11].id_ustensile,
      }, // Moule à tarte
      {
        id_recette: recipes[11].id_recette,
        id_ustensile: ustensils[8].id_ustensile,
      }, // Four

      // Ustensiles pour les Cailles en Sarcophage
      {
        id_recette: recipes[9].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[9].id_recette,
        id_ustensile: ustensils[8].id_ustensile,
      }, // Four
      {
        id_recette: recipes[9].id_recette,
        id_ustensile: ustensils[9].id_ustensile,
      }, // Plat

      // Ustensiles pour la Soupe de tortue
      {
        id_recette: recipes[10].id_recette,
        id_ustensile: ustensils[2].id_ustensile,
      }, // Casserole
      {
        id_recette: recipes[10].id_recette,
        id_ustensile: ustensils[0].id_ustensile,
      }, // Couteau
      {
        id_recette: recipes[10].id_recette,
        id_ustensile: ustensils[10].id_ustensile,
      }, // Cuillère
    ]);

    // Création des commentaires pour toutes les recettes
    await Comment.bulkCreate([
      // Commentaires pour Ratatouille
      {
        contenu: "Une ratatouille digne du film !",
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[0].id_recette,
      },
      {
        contenu: "La présentation est magnifique",
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[0].id_recette,
      },
      // Commentaires pour Second petit-déjeuner hobbit
      {
        contenu: "Parfait pour une longue journée d'aventure",
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[1].id_recette,
      },
      {
        contenu: "Les champignons sont délicieux",
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[1].id_recette,
      },
      // Commentaires pour Bièraubeurre
      {
        contenu: "On se croirait aux Trois Balais !",
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[2].id_recette,
      },
      {
        contenu: "Parfaite pour l'hiver",
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[2].id_recette,
      },
      // Commentaires pour Donuts d'Homer
      {
        contenu: "Mmmm... Donuts !",
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[3].id_recette,
      },
      {
        contenu: "Aussi bons que chez les Simpsons",
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[3].id_recette,
      },
      // Commentaires pour Bœuf Bourguignon
      {
        contenu: "Une recette authentique",
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[4].id_recette,
      },
      {
        contenu: "Julia Child serait fière",
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[4].id_recette,
      },
    ]);

    // Création des notations pour toutes les recettes
    await Rating.bulkCreate([
      {
        note: 5,
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[0].id_recette,
      },
      {
        note: 4,
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[0].id_recette,
      },
      {
        note: 5,
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[1].id_recette,
      },
      {
        note: 4,
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[1].id_recette,
      },
      {
        note: 5,
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[2].id_recette,
      },
      {
        note: 4,
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[2].id_recette,
      },
      {
        note: 5,
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[3].id_recette,
      },
      {
        note: 4,
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[3].id_recette,
      },
      {
        note: 5,
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[4].id_recette,
      },
      {
        note: 4,
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[4].id_recette,
      },
    ]);

    // Création des favoris
    await Favorite.bulkCreate([
      // Favoris de l'utilisateur chef_ratatouille
      {
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[0].id_recette, // Ratatouille
      },
      {
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[4].id_recette, // Bœuf Bourguignon
      },
      {
        id_utilisateur: users[1].id_utilisateur,
        id_recette: recipes[5].id_recette, // Sole Meunière
      },

      // Favoris de l'utilisateur hobbit_gourmet
      {
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[1].id_recette, // Second petit-déjeuner hobbit
      },
      {
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[6].id_recette, // Chocolat chaud épicé
      },
      {
        id_utilisateur: users[2].id_utilisateur,
        id_recette: recipes[8].id_recette, // Italian Beef Sandwich
      },

      // Favoris de l'utilisateur foodie_expert
      {
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[5].id_recette, // Sole Meunière
      },
      {
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[3].id_recette, // Donuts d'Homer
      },
      {
        id_utilisateur: users[3].id_utilisateur,
        id_recette: recipes[9].id_recette, // Risotto aux champignons
      },

      // Favoris de l'utilisateur gourmet_master
      {
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[6].id_recette, // Chocolat chaud épicé
      },
      {
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[2].id_recette, // Bièraubeurre
      },
      {
        id_utilisateur: users[4].id_utilisateur,
        id_recette: recipes[10].id_recette, // Pudding de Noël
      },
    ]);

    console.log("Base de données peuplée avec succès !");
  } catch (error) {
    console.error("Erreur lors du peuplement de la base de données:", error);
  }
}

module.exports = seedDatabase;
