-- =============================================================================
-- SCRIPT DE PEUPLEMENT (SEED) - CATALOGUE LEMARK
-- =============================================================================

-- 1. Catégories
INSERT INTO categorie (id_categorie, nom_categorie) VALUES
                                                        (1, 'Surfaceuses'),
                                                        (2, 'Rouleaux & Compacteurs'),
                                                        (3, 'Débuscage & Foresterie'),
                                                        (4, 'Remorques'),
                                                        (5, 'Niveleuses & Herses'),
                                                        (6, 'Foyers Extérieurs');

-- 2. Produits
INSERT INTO produit (id_produit, nom_produit, description_courte, description_longue, est_nouveaute, id_categorie) VALUES
                                                                                                                       (1, 'Surfaceuse FAT', 'Description courte', 'Description longue', FALSE, 1),
                                                                                                                       (2, 'Surfaceuse Série-Pro', 'Description courte', 'Description longue', FALSE, 1),
                                                                                                                       (3, 'Rouleau à Pics Série-F', 'Description courte', 'Description longue', FALSE, 2),
                                                                                                                       (4, 'Rouleau à Pics Série-T', 'Description courte', 'Description longue', FALSE, 2),
                                                                                                                       (5, 'Rouleau à Neige Série-N', 'Description courte', 'Description longue', FALSE, 2),
                                                                                                                       (6, 'Débusqueuse Type-S', 'Description courte', 'Description longue', FALSE, 3),
                                                                                                                       (7, 'Remorque RK Dompeur', 'Description courte', 'Description longue', FALSE, 4),
                                                                                                                       (8, 'Remorque RK Bascule', 'Description courte', 'Description longue', FALSE, 4),
                                                                                                                       (9, 'Remorque RK Hybride', 'Description courte', 'Description longue', FALSE, 4),
                                                                                                                       (10, 'Remorque RK Déchiqueteuse', 'Description courte', 'Description longue', FALSE, 4),
                                                                                                                       (11, 'Remorque RK Tôte', 'Description courte', 'Description longue', FALSE, 4),
                                                                                                                       (12, 'Remorque Jardin', 'Description courte', 'Description longue', FALSE, 4),
                                                                                                                       (13, 'Niveleuse LM', 'Description courte', 'Description longue', FALSE, 5),
                                                                                                                       (14, 'Niveleuse H', 'Description courte', 'Description longue', FALSE, 5),
                                                                                                                       (15, 'Foyer Extérieur Série-M', 'Description courte', 'Description longue', FALSE, 6);

-- 3. Options d'équipement
INSERT INTO options_equipement (id_option, nom_option, sku, description_option) VALUES
                                                                                    (1, 'Re-Surfaceur', 'S-O-RESU', 'Description'),
                                                                                    (2, 'Traceur-Pro', 'S-O-TRPR', 'Description'),
                                                                                    (3, 'Traceur-Eco', 'S-O-TREC', 'Description'),
                                                                                    (4, 'Grattoir', 'S-O-GRAT', 'Description'),
                                                                                    (5, 'Roues', 'S-O-ROUE', 'Description'),
                                                                                    (6, 'Ski SkimarkTD', 'RC-O-SKIS', 'Description'),
                                                                                    (7, 'Roues', 'NH-O-ROUE', 'Description'),
                                                                                    (8, 'Déflecteurs', 'NH-O-DEFL', 'Description');

-- 4. Modèles
INSERT INTO modele (id_modele, sku, nom_modele, specifications, id_produit) VALUES
                                                                                (1, 'S-SF36', 'SF36', 'Largeur x Profondeur', 1),
                                                                                (2, 'S-SF48', 'SF48', 'Largeur x Profondeur', 1),
                                                                                (3, 'S-SF60', 'SF60', 'Largeur x Profondeur', 1),
                                                                                (4, 'S-SP36', 'SP36', 'Largeur x Profondeur', 2),
                                                                                (5, 'S-SP48', 'SP48', 'Largeur x Profondeur', 2),
                                                                                (6, 'S-SP60', 'SP60', 'Largeur x Profondeur', 2),
                                                                                (7, 'S-SP72', 'SP72', 'Largeur x Profondeur', 2),
                                                                                (8, 'S-SP84', 'SP84', 'Largeur x Profondeur', 2),
                                                                                (9, 'RC-SF60', 'SF60', 'Largeur x Profondeur', 3),
                                                                                (10, 'RC-SF96', 'SF96', 'Largeur x Profondeur', 3),
                                                                                (11, 'RC-ST48', 'ST48', 'Largeur x Profondeur', 4),
                                                                                (12, 'RC-ST54', 'ST54', 'Largeur x Profondeur', 4),
                                                                                (13, 'RC-SN54', 'SN54', 'Largeur x Profondeur', 5),
                                                                                (14, 'DF-TS99', 'TS99', 'Largeur x Profondeur', 6),
                                                                                (15, 'RM-D3060SP', 'D3060SP', 'Largeur x Profondeur', 7),
                                                                                (16, 'RM-D3060TP', 'D3060TP', 'Largeur x Profondeur', 7),
                                                                                (17, 'RM-D3672TP', 'D3672TP', 'Largeur x Profondeur', 7),
                                                                                (18, 'RM-D4872TP', 'D4872TP', 'Largeur x Profondeur', 7),
                                                                                (19, 'RM-D4872TM', 'D4872TM', 'Largeur x Profondeur', 7),
                                                                                (20, 'RM-B4848SM', 'B4848SM', 'Largeur x Profondeur', 8),
                                                                                (21, 'RM-B3060SP', 'B3060SP', 'Largeur x Profondeur', 8),
                                                                                (22, 'RM-B4872TM', 'B4872TM', 'Largeur x Profondeur', 8),
                                                                                (23, 'RM-H3060T', 'H3060T', 'Largeur x Profondeur', 9),
                                                                                (24, 'RM-DT99', 'DT99', 'Largeur x Profondeur', 10),
                                                                                (25, 'RM-JD99', 'JD99', 'Largeur x Profondeur', 12),
                                                                                (26, 'RM-TT99', 'TT99', 'Largeur x Profondeur', 11),
                                                                                (27, 'NH-LM48', 'LM48', 'Largeur x Profondeur', 13),
                                                                                (28, 'NH-LM60', 'LM60', 'Largeur x Profondeur', 13),
                                                                                (29, 'NH-LM72', 'LM72', 'Largeur x Profondeur', 13),
                                                                                (30, 'NH-LM72X3', 'LM72X3', 'Largeur x Profondeur', 13),
                                                                                (31, 'NH-H3', 'H3', 'Largeur x Profondeur', 14),
                                                                                (32, 'NH-H4', 'H4', 'Largeur x Profondeur', 14),
                                                                                (33, 'NH-H5', 'H5', 'Largeur x Profondeur', 14),
                                                                                (34, 'F-M20', 'M20', 'Largeur x Profondeur', 15),
                                                                                (35, 'F-M26', 'M26', 'Largeur x Profondeur', 15),
                                                                                (36, 'F-M36', 'M36', 'Largeur x Profondeur', 15);

-- 5. Association Produits <-> Options (Table Compatible)
INSERT INTO compatible (id_produit, id_option) VALUES
                                                   (1, 1),
                                                   (2, 2),
                                                   (2, 3),
                                                   (2, 4),
                                                   (2, 5),
                                                   (7, 6),
                                                   (8, 6),
                                                   (9, 6),
                                                   (10, 6),
                                                   (11, 6),
                                                   (13, 7),
                                                   (14, 8);

-- 6. Synchronisation des séquences PostgreSQL (évite les erreurs de doublons lors des futurs ajouts)
SELECT setval(pg_get_serial_sequence('categorie', 'id_categorie'), COALESCE((SELECT MAX(id_categorie) FROM categorie), 1));
SELECT setval(pg_get_serial_sequence('produit', 'id_produit'), COALESCE((SELECT MAX(id_produit) FROM produit), 1));
SELECT setval(pg_get_serial_sequence('options_equipement', 'id_option'), COALESCE((SELECT MAX(id_option) FROM options_equipement), 1));
SELECT setval(pg_get_serial_sequence('modele', 'id_modele'), COALESCE((SELECT MAX(id_modele) FROM modele), 1));