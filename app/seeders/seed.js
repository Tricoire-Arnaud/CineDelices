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
    Favorite 
} = require('../models');

const bcrypt = require('bcrypt');

async function seedDatabase() {
    try {
        // Création des utilisateurs
        const users = await User.bulkCreate([
            {
                nom_utilisateur: 'admin',
                email: 'admin@cinedelices.fr',
                mot_de_passe: await bcrypt.hash('admin123', 10),
                role: 'admin'
            },
            {
                nom_utilisateur: 'chef_ratatouille',
                email: 'chef@cinedelices.fr',
                mot_de_passe: await bcrypt.hash('chef123', 10),
                role: 'utilisateur'
            },
            {
                nom_utilisateur: 'hobbit_gourmet',
                email: 'hobbit@cinedelices.fr',
                mot_de_passe: await bcrypt.hash('hobbit123', 10),
                role: 'utilisateur'
            },
            {
                nom_utilisateur: 'foodie_expert',
                email: 'expert@cinedelices.fr',
                mot_de_passe: await bcrypt.hash('expert123', 10),
                role: 'utilisateur'
            },
            {
                nom_utilisateur: 'gourmet_master',
                email: 'master@cinedelices.fr',
                mot_de_passe: await bcrypt.hash('master123', 10),
                role: 'utilisateur'
            }
        ]);

        // Création des catégories
        const categories = await Category.bulkCreate([
            { libelle: 'Entrée' },
            { libelle: 'Plat principal' },
            { libelle: 'Dessert' },
            { libelle: 'Boisson' },
            { libelle: 'Snack' },
            { libelle: 'Apéritif' } 
        ]);

        // Création des œuvres (films, séries et documentaires)
        const movies = await Movie.bulkCreate([
            {
                titre: 'Ratatouille',
                type: 'film',
                annee: 2007,
                description: 'Un rat qui rêve de devenir chef cuisinier à Paris'
            },
            {
                titre: 'Le Seigneur des Anneaux',
                type: 'film',
                annee: 2001,
                description: 'L\'épopée fantastique de la Terre du Milieu'
            },
            {
                titre: 'Harry Potter',
                type: 'film',
                annee: 2001,
                description: 'Les aventures du célèbre sorcier'
            },
            {
                titre: 'Chef',
                type: 'film',
                annee: 2014,
                description: 'Un chef qui redécouvre sa passion pour la cuisine'
            },
            {
                titre: 'Game of Thrones',
                type: 'série',
                annee: 2011,
                description: 'Une saga médiévale-fantastique épique'
            },
            {
                titre: 'Breaking Bad',
                type: 'série',
                annee: 2008,
                description: 'L\'histoire d\'un professeur de chimie devenu criminel'
            },
            {
                titre: 'Les Simpsons',
                type: 'série',
                annee: 1989,
                description: 'Les aventures d\'une famille américaine déjantée'
            },
            {
                titre: 'Julie et Julia',
                type: 'film',
                annee: 2009,
                description: 'L\'histoire parallèle de Julia Child et d\'une blogueuse culinaire'
            },
            {
                titre: 'Le Grand Restaurant',
                type: 'film',
                annee: 1966,
                description: 'Les aventures de Monsieur Septime dans son restaurant gastronomique'
            },
            {
                titre: 'Chocolat',
                type: 'film',
                annee: 2000,
                description: 'L\'histoire d\'une chocolatière qui bouleverse une petite ville française'
            },
            {
                titre: 'The Bear',
                type: 'série',
                annee: 2022,
                description: 'Un jeune chef étoilé reprend le restaurant familial de sandwichs à Chicago'
            },
            {
                titre: 'Downton Abbey',
                type: 'série',
                annee: 2010,
                description: 'La vie d\'une famille aristocratique anglaise et de leurs domestiques'
            },
            {
                titre: 'Babette\'s Feast',
                type: 'film',
                annee: 1987,
                description: 'Une réfugiée française prépare un festin somptueux pour un village danois'
            }
        ]);

        // Création des ingrédients de base
        const ingredients = await Ingredient.bulkCreate([
            { nom_ingredient: 'Tomate', unite_mesure: 'pièce' },
            { nom_ingredient: 'Aubergine', unite_mesure: 'pièce' },
            { nom_ingredient: 'Courgette', unite_mesure: 'pièce' },
            { nom_ingredient: 'Poivron', unite_mesure: 'pièce' },
            { nom_ingredient: 'Oignon', unite_mesure: 'pièce' },
            { nom_ingredient: 'Ail', unite_mesure: 'gousse' },
            { nom_ingredient: 'Huile d\'olive', unite_mesure: 'ml' },
            { nom_ingredient: 'Beurre', unite_mesure: 'g' },
            { nom_ingredient: 'Farine', unite_mesure: 'g' },
            { nom_ingredient: 'Lait', unite_mesure: 'ml' },
            { nom_ingredient: 'Champignons', unite_mesure: 'g' },
            { nom_ingredient: 'Pommes de terre', unite_mesure: 'g' },
            { nom_ingredient: 'Bière au beurre', unite_mesure: 'ml' },
            { nom_ingredient: 'Poulet', unite_mesure: 'g' },
            { nom_ingredient: 'Citron', unite_mesure: 'pièce' },
            { nom_ingredient: 'Chocolat', unite_mesure: 'g' },
            { nom_ingredient: 'Sucre', unite_mesure: 'g' },
            { nom_ingredient: 'Caramel', unite_mesure: 'ml' },
            { nom_ingredient: 'Pain', unite_mesure: 'g' },
            { nom_ingredient: 'Bacon', unite_mesure: 'g' },
            { nom_ingredient: 'Œufs', unite_mesure: 'pièce' },
            { nom_ingredient: 'Fromage', unite_mesure: 'g' },
            { nom_ingredient: 'Épices diverses', unite_mesure: 'g' },
            { nom_ingredient: 'Basilic', unite_mesure: 'g' },
            { nom_ingredient: 'Miel', unite_mesure: 'ml' },
            { nom_ingredient: 'Vinaigre balsamique', unite_mesure: 'ml' }
        ]);


        // Création des ustensiles
        const ustensils = await Utensil.bulkCreate([
            { nom_ustensile: 'Couteau de chef' },
            { nom_ustensile: 'Planche à découper' },
            { nom_ustensile: 'Casserole' },
            { nom_ustensile: 'Poêle' },
            { nom_ustensile: 'Fouet' },
            { nom_ustensile: 'Spatule' },
            { nom_ustensile: 'Mandoline' },
            { nom_ustensile: 'Robot mixeur' },
            { nom_ustensile: 'Four' } 
        ]);

        // Création des recettes existantes
        const recipes = await Recipe.bulkCreate([
            {
                titre: 'Ratatouille de Rémy',
                description: 'La fameuse ratatouille qui a conquis le critique Anton Ego',
                etapes: JSON.stringify([
                    'Laver et couper tous les légumes en fines tranches',
                    'Préparer la sauce tomate',
                    'Disposer les légumes en rosace',
                    'Cuire au four pendant 45 minutes'
                ]),
                temps_preparation: 45,
                temps_cuisson: 45,
                difficulte: 4,
                anecdote: 'Cette recette est directement inspirée du film Ratatouille, où Rémy revisite ce plat traditionnel.',
                image: 'ratatouille.jpg',
                id_oeuvre: movies[0].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Second petit-déjeuner hobbit',
                description: 'Un copieux petit-déjeuner digne des hobbits',
                etapes: JSON.stringify([
                    'Préparer les champignons sautés',
                    'Cuire les pommes de terre',
                    'Faire griller le bacon',
                    'Servir avec du pain frais'
                ]),
                temps_preparation: 30,
                temps_cuisson: 25,
                difficulte: 2,
                anecdote: 'Les hobbits prennent jusqu\'à sept repas par jour, dont le second petit-déjeuner !',
                image: 'hobbit-breakfast.jpg',
                id_oeuvre: movies[1].id_oeuvre,
                id_categorie: categories[0].id_categorie
            },
            {
                titre: 'Bièraubeurre',
                description: 'La boisson préférée des élèves de Poudlard',
                etapes: JSON.stringify([
                    'Faire chauffer le beurre avec les épices',
                    'Ajouter le caramel',
                    'Incorporer la bière',
                    'Servir chaud ou froid'
                ]),
                temps_preparation: 15,
                temps_cuisson: 10,
                difficulte: 2,
                anecdote: 'La Bièraubeurre est servie aux Trois Balais à Pré-au-Lard.',
                image: 'butterbeer.jpg',
                id_oeuvre: movies[2].id_oeuvre,
                id_categorie: categories[3].id_categorie
            },
            {
                titre: 'Tourte au poulet façon Mrs Weasley',
                description: 'La réconfortante tourte au poulet servie au Terrier',
                etapes: JSON.stringify([
                    'Préparer la pâte brisée',
                    'Cuire le poulet avec les légumes',
                    'Préparer la sauce',
                    'Assembler la tourte',
                    'Cuire au four'
                ]),
                temps_preparation: 60,
                temps_cuisson: 45,
                difficulte: 3,
                anecdote: 'Un des plats préférés de Ron Weasley, servi régulièrement au Terrier.',
                image: 'chicken-pie.jpg',
                id_oeuvre: movies[2].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Pain elfique Lembas',
                description: 'Le pain de route des elfes de la Terre du Milieu',
                etapes: JSON.stringify([
                    'Mélanger les ingrédients secs',
                    'Incorporer les ingrédients humides',
                    'Former des galettes',
                    'Cuire délicatement au four'
                ]),
                temps_preparation: 30,
                temps_cuisson: 20,
                difficulte: 3,
                anecdote: 'Une seule bouchée suffit à nourrir un homme adulte pour toute une journée de marche.',
                image: 'lembas.jpg',
                id_oeuvre: movies[1].id_oeuvre,
                id_categorie: categories[4].id_categorie
            },
            {
                titre: 'Festin de Winterfell',
                description: 'Un copieux ragoût du Nord',
                etapes: JSON.stringify([
                    'Préparer la viande',
                    'Faire revenir les légumes',
                    'Mijoter longuement',
                    'Servir bien chaud'
                ]),
                temps_preparation: 45,
                temps_cuisson: 180,
                difficulte: 3,
                anecdote: 'Un plat typique du Nord, servi aux Stark et leurs invités.',
                image: 'winterfell-stew.jpg',
                id_oeuvre: movies[4].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Donuts d\'Homer Simpson',
                description: 'Les fameux donuts roses avec glaçage et vermicelles',
                etapes: JSON.stringify([
                    'Préparer la pâte à beignets',
                    'Former les donuts',
                    'Frire les donuts',
                    'Glacer et décorer'
                ]),
                temps_preparation: 40,
                temps_cuisson: 15,
                difficulte: 3,
                anecdote: 'Le met préféré d\'Homer Simpson, souvent accompagné d\'une Duff Beer.',
                image: 'homer-donut.jpg',
                id_oeuvre: movies[6].id_oeuvre,
                id_categorie: categories[2].id_categorie
            },
            {
                titre: 'Bœuf Bourguignon de Julia Child',
                description: 'La recette emblématique de la chef Julia Child',
                etapes: JSON.stringify([
                    'Préparer la viande et les légumes',
                    'Faire revenir la viande',
                    'Ajouter le vin et les aromates',
                    'Mijoter longuement'
                ]),
                temps_preparation: 60,
                temps_cuisson: 180,
                difficulte: 4,
                anecdote: 'Cette recette a fait connaître Julia Child et la cuisine française aux Américains.',
                image: 'boeuf-bourguignon.jpg',
                id_oeuvre: movies[7].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Sushi à la Jiro',
                description: 'Une interprétation inspirée du documentaire pour les amateurs de sushi',
                etapes: JSON.stringify([
                    'Préparer le riz à sushi',
                    'Assaisonner avec vinaigre et miel',
                    'Découper le poisson frais',
                    'Assembler les sushis avec soin'
                ]),
                temps_preparation: 50,
                temps_cuisson: 20,
                difficulte: 5,
                anecdote: 'Inspiré par Jiro, ce sushi demande précision et passion.',
                image: 'jiro-sushi.jpg',
                id_oeuvre: movies[8].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Sole Meunière de Septime',
                description: 'La spécialité du Grand Restaurant',
                etapes: JSON.stringify([
                    'Préparer la sole',
                    'Faire fondre le beurre',
                    'Cuire la sole',
                    'Préparer la sauce au citron'
                ]),
                temps_preparation: 20,
                temps_cuisson: 15,
                difficulte: 4,
                anecdote: 'Le plat signature de M. Septime, servi avec une maladresse légendaire !',
                image: 'sole-meuniere.jpg',
                id_oeuvre: movies[8].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Canard à l\'orange façon Septime',
                description: 'Un classique de la cuisine française revisité',
                etapes: JSON.stringify([
                    'Préparer le canard',
                    'Faire la sauce à l\'orange',
                    'Rôtir le canard',
                    'Napper de sauce'
                ]),
                temps_preparation: 40,
                temps_cuisson: 60,
                difficulte: 4,
                anecdote: 'Le plat qui a failli être servi au président !',
                image: 'canard-orange.jpg',
                id_oeuvre: movies[9].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Chocolat chaud épicé de Vianne',
                description: 'Le chocolat chaud qui réchauffe les cœurs',
                etapes: JSON.stringify([
                    'Faire fondre le chocolat',
                    'Ajouter les épices',
                    'Incorporer le lait chaud',
                    'Mélanger jusqu\'à onctuosité'
                ]),
                temps_preparation: 15,
                temps_cuisson: 10,
                difficulte: 2,
                anecdote: 'La recette secrète qui a transformé tout un village',
                image: 'chocolat-epice.jpg',
                id_oeuvre: movies[9].id_oeuvre,
                id_categorie: categories[3].id_categorie
            },
            {
                titre: 'Truffes au chocolat maya',
                description: 'Truffes au chocolat avec une touche d\'épices anciennes',
                etapes: JSON.stringify([
                    'Préparer la ganache',
                    'Incorporer les épices',
                    'Former les truffes',
                    'Rouler dans le cacao'
                ]),
                temps_preparation: 30,
                temps_cuisson: 0,
                difficulte: 3,
                anecdote: 'Inspirées des recettes ancestrales mayas',
                image: 'truffes-maya.jpg',
                id_oeuvre: movies[9].id_oeuvre,
                id_categorie: categories[2].id_categorie
            },
            {
                titre: 'Italian Beef Sandwich',
                description: 'Le sandwich signature du Original Beef of Chicagoland',
                etapes: JSON.stringify([
                    'Préparer le rôti de bœuf',
                    'Faire le jus (au jus)',
                    'Préparer les piments',
                    'Assembler le sandwich'
                ]),
                temps_preparation: 30,
                temps_cuisson: 240,
                difficulte: 3,
                anecdote: 'La recette qui a fait la réputation du restaurant',
                image: 'italian-beef.jpg',
                id_oeuvre: movies[10].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Risotto aux champignons de Carmy',
                description: 'Un risotto parfaitement crémeux',
                etapes: JSON.stringify([
                    'Préparer le bouillon',
                    'Faire revenir le riz',
                    'Incorporer le bouillon progressivement',
                    'Ajouter les champignons'
                ]),
                temps_preparation: 20,
                temps_cuisson: 25,
                difficulte: 4,
                anecdote: 'La recette qui rappelle ses années en cuisine gastronomique',
                image: 'risotto.jpg',
                id_oeuvre: movies[10].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Pudding de Noël de Mrs Patmore',
                description: 'Le dessert traditionnel de Downton Abbey',
                etapes: JSON.stringify([
                    'Préparer les fruits secs',
                    'Mélanger les ingrédients',
                    'Cuire à la vapeur',
                    'Flamber au cognac'
                ]),
                temps_preparation: 45,
                temps_cuisson: 180,
                difficulte: 4,
                anecdote: 'Servi chaque année au dîner de Noël de Downton',
                image: 'christmas-pudding.jpg',
                id_oeuvre: movies[11].id_oeuvre,
                id_categorie: categories[2].id_categorie
            },
            {
                titre: 'Tarte aux pommes à l\'anglaise',
                description: 'Une tarte traditionnelle servie à l\'heure du thé',
                etapes: JSON.stringify([
                    'Préparer la pâte',
                    'Couper les pommes',
                    'Assembler la tarte',
                    'Cuire au four'
                ]),
                temps_preparation: 30,
                temps_cuisson: 45,
                difficulte: 3,
                anecdote: 'La recette préférée de la Comtesse douairière',
                image: 'apple-pie.jpg',
                id_oeuvre: movies[11].id_oeuvre,
                id_categorie: categories[2].id_categorie
            },
            {
                titre: 'Cailles en Sarcophage',
                description: 'Le plat principal du festin de Babette',
                etapes: JSON.stringify([
                    'Préparer les cailles',
                    'Faire la farce',
                    'Assembler en croûte',
                    'Cuire au four'
                ]),
                temps_preparation: 90,
                temps_cuisson: 45,
                difficulte: 5,
                anecdote: 'Le plat qui a transformé un simple dîner en expérience transcendante',
                image: 'cailles.jpg',
                id_oeuvre: movies[12].id_oeuvre,
                id_categorie: categories[1].id_categorie
            },
            {
                titre: 'Soupe de tortue à la française',
                description: 'Une soupe raffinée et complexe',
                etapes: JSON.stringify([
                    'Préparer le bouillon',
                    'Cuire les légumes',
                    'Incorporer les herbes',
                    'Mijoter longuement'
                ]),
                temps_preparation: 60,
                temps_cuisson: 180,
                difficulte: 5,
                anecdote: 'Un des plats emblématiques du festin de Babette',
                image: 'turtle-soup.jpg',
                id_oeuvre: movies[12].id_oeuvre,
                id_categorie: categories[0].id_categorie
            }
        ]);



        // Création des associations recettes-ingrédients
        await RecipeIngredient.bulkCreate([
            // Ingrédients pour la Ratatouille (recette 0)
            { id_recette: recipes[0].id_recette, id_ingredient: ingredients[0].id_ingredient, quantite: '4' }, // Tomate
            { id_recette: recipes[0].id_recette, id_ingredient: ingredients[1].id_ingredient, quantite: '2' }, // Aubergine
            { id_recette: recipes[0].id_recette, id_ingredient: ingredients[2].id_ingredient, quantite: '3' }, // Courgette
            { id_recette: recipes[0].id_recette, id_ingredient: ingredients[3].id_ingredient, quantite: '2' }, // Poivron
            { id_recette: recipes[0].id_recette, id_ingredient: ingredients[4].id_ingredient, quantite: '2' }, // Oignon

            // Ingrédients pour le Second petit-déjeuner hobbit (recette 1)
            { id_recette: recipes[1].id_recette, id_ingredient: ingredients[10].id_ingredient, quantite: '300' }, // Champignons
            { id_recette: recipes[1].id_recette, id_ingredient: ingredients[11].id_ingredient, quantite: '500' }, // Pommes de terre
            { id_recette: recipes[1].id_recette, id_ingredient: ingredients[19].id_ingredient, quantite: '200' }, // Bacon

            // Ingrédients pour la Bièraubeurre (recette 2)
            { id_recette: recipes[2].id_recette, id_ingredient: ingredients[7].id_ingredient, quantite: '100' }, // Beurre
            { id_recette: recipes[2].id_recette, id_ingredient: ingredients[12].id_ingredient, quantite: '500' }, // Bière
            { id_recette: recipes[2].id_recette, id_ingredient: ingredients[17].id_ingredient, quantite: '100' }, // Caramel

            // Ingrédients pour les Donuts (recette 3)
            { id_recette: recipes[3].id_recette, id_ingredient: ingredients[8].id_ingredient, quantite: '500' }, // Farine
            { id_recette: recipes[3].id_recette, id_ingredient: ingredients[15].id_ingredient, quantite: '200' }, // Sucre
            { id_recette: recipes[3].id_recette, id_ingredient: ingredients[20].id_ingredient, quantite: '3' }, // Œufs
            { id_recette: recipes[3].id_recette, id_ingredient: ingredients[14].id_ingredient, quantite: '100' }, // Chocolat

            // Ingrédients pour le Bœuf Bourguignon (recette 4)
            { id_recette: recipes[4].id_recette, id_ingredient: ingredients[4].id_ingredient, quantite: '4' }, // Oignon
            { id_recette: recipes[4].id_recette, id_ingredient: ingredients[5].id_ingredient, quantite: '6' }, // Ail
            { id_recette: recipes[4].id_recette, id_ingredient: ingredients[6].id_ingredient, quantite: '100' }, // Huile d'olive
            { id_recette: recipes[4].id_recette, id_ingredient: ingredients[22].id_ingredient, quantite: '20' } // Épices
        ]);

        // Associations recettes-ustensiles pour les recettes existantes
        await RecipeUtensil.bulkCreate([
            // Ustensiles pour la Ratatouille
            { id_recette: recipes[0].id_recette, id_ustensile: ustensils[0].id_ustensile },
            { id_recette: recipes[0].id_recette, id_ustensile: ustensils[1].id_ustensile },
            { id_recette: recipes[0].id_recette, id_ustensile: ustensils[6].id_ustensile },

            // Ustensiles pour le petit-déjeuner hobbit
            { id_recette: recipes[1].id_recette, id_ustensile: ustensils[3].id_ustensile },
            { id_recette: recipes[1].id_recette, id_ustensile: ustensils[5].id_ustensile },

            // Ustensiles pour la Bièraubeurre
            { id_recette: recipes[2].id_recette, id_ustensile: ustensils[2].id_ustensile },
            { id_recette: recipes[2].id_recette, id_ustensile: ustensils[4].id_ustensile }
        ]);

        // Création des commentaires pour toutes les recettes
        await Comment.bulkCreate([
            // Commentaires pour Ratatouille
            {
                contenu: 'Une ratatouille digne du film !',
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[0].id_recette
            },
            {
                contenu: 'La présentation est magnifique',
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[0].id_recette
            },
            // Commentaires pour Second petit-déjeuner hobbit
            {
                contenu: 'Parfait pour une longue journée d\'aventure',
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[1].id_recette
            },
            {
                contenu: 'Les champignons sont délicieux',
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[1].id_recette
            },
            // Commentaires pour Bièraubeurre
            {
                contenu: 'On se croirait aux Trois Balais !',
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[2].id_recette
            },
            {
                contenu: 'Parfaite pour l\'hiver',
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[2].id_recette
            },
            // Commentaires pour Donuts d'Homer
            {
                contenu: 'Mmmm... Donuts !',
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[3].id_recette
            },
            {
                contenu: 'Aussi bons que chez les Simpsons',
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[3].id_recette
            },
            // Commentaires pour Bœuf Bourguignon
            {
                contenu: 'Une recette authentique',
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[4].id_recette
            },
            {
                contenu: 'Julia Child serait fière',
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[4].id_recette
            }
        ]);

        // Création des notations pour toutes les recettes
        await Rating.bulkCreate([
            {
                note: 5,
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[0].id_recette
            },
            {
                note: 4,
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[0].id_recette
            },
            {
                note: 5,
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[1].id_recette
            },
            {
                note: 4,
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[1].id_recette
            },
            {
                note: 5,
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[2].id_recette
            },
            {
                note: 4,
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[2].id_recette
            },
            {
                note: 5,
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[3].id_recette
            },
            {
                note: 4,
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[3].id_recette
            },
            {
                note: 5,
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[4].id_recette
            },
            {
                note: 4,
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[4].id_recette
            }
        ]);

        // Création des favoris
        await Favorite.bulkCreate([
            // Favoris de l'utilisateur chef_ratatouille
            {
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[0].id_recette  // Ratatouille
            },
            {
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[4].id_recette  // Bœuf Bourguignon
            },
            {
                id_utilisateur: users[1].id_utilisateur,
                id_recette: recipes[5].id_recette  // Sole Meunière
            },

            // Favoris de l'utilisateur hobbit_gourmet
            {
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[1].id_recette  // Second petit-déjeuner hobbit
            },
            {
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[6].id_recette  // Chocolat chaud épicé
            },
            {
                id_utilisateur: users[2].id_utilisateur,
                id_recette: recipes[8].id_recette  // Italian Beef Sandwich
            },

            // Favoris de l'utilisateur foodie_expert
            {
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[5].id_recette  // Sole Meunière
            },
            {
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[3].id_recette  // Donuts d'Homer
            },
            {
                id_utilisateur: users[3].id_utilisateur,
                id_recette: recipes[9].id_recette  // Risotto aux champignons
            },

            // Favoris de l'utilisateur gourmet_master
            {
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[6].id_recette  // Chocolat chaud épicé
            },
            {
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[2].id_recette  // Bièraubeurre
            },
            {
                id_utilisateur: users[4].id_utilisateur,
                id_recette: recipes[10].id_recette // Pudding de Noël
            }
        ]);

        console.log('Base de données peuplée avec succès !');
    } catch (error) {
        console.error('Erreur lors du peuplement de la base de données:', error);
    }
}

module.exports = seedDatabase;
