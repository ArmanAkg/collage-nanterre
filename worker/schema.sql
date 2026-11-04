CREATE TABLE IF NOT EXISTS passages (
  id INTEGER PRIMARY KEY,
  p TEXT NOT NULL,   -- numéro de l'emplacement
  t TEXT NOT NULL,   -- colle, ok ou recouvert
  d TEXT NOT NULL,   -- date du passage, AAAA-MM-JJ
  b TEXT NOT NULL    -- identifiant du lot, pour l'annulation
);
CREATE INDEX IF NOT EXISTS passages_b ON passages (b);
