-- Table de liaison pour les recettes favorites des utilisateurs
CREATE TABLE IF NOT EXISTS user_favorites (
  id_utilisateur INTEGER NOT NULL REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE,
  id_recette INTEGER NOT NULL REFERENCES recettes(id_recette) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_utilisateur, id_recette)
);

-- Index pour améliorer les performances des recherches
CREATE INDEX idx_user_favorites_user ON user_favorites(id_utilisateur);
CREATE INDEX idx_user_favorites_recipe ON user_favorites(id_recette);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_user_favorites_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_favorites_timestamp
  BEFORE UPDATE ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_user_favorites_timestamp(); 