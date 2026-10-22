CREATE TABLE Categorie(
                          id_categorie INTEGER,
                          nom_categorie VARCHAR(50),
                          PRIMARY KEY(id_categorie)
);

CREATE TABLE Produit(
                        id_produit INTEGER,
                        nom_produit VARCHAR(50),
                        description_courte VARCHAR(255), -- Augmenté pour éviter les coupures
                        description_longue TEXT,         -- Modifié en TEXT pour les longs paragraphes
                        est_nouveaute BOOLEAN,
                        id_categorie INTEGER NOT NULL,
                        PRIMARY KEY(id_produit),
                        FOREIGN KEY(id_categorie) REFERENCES Categorie(id_categorie) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Image_Produit(
                              id_image INTEGER,
                              id_modele INTEGER,
                              nom_fichier VARCHAR(255),
                              ordre_affichage INTEGER,
                              id_produit INTEGER NOT NULL,
                              PRIMARY KEY(id_image),
                              FOREIGN KEY(id_produit) REFERENCES Produit(id_produit) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Modele(
                       id_modele INTEGER,
                       sku VARCHAR(50),
                       nom_modele VARCHAR(50),
                       specifications VARCHAR(255),
                       id_produit INTEGER NOT NULL,
                       PRIMARY KEY(id_modele),
                       FOREIGN KEY(id_produit) REFERENCES Produit(id_produit) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Options_Equipement(
                                   id_option INTEGER,
                                   nom_option VARCHAR(50),
                                   sku VARCHAR(50),
                                   description_option VARCHAR(255),
                                   nom_fichier_image VARCHAR(255),
                                   PRIMARY KEY(id_option)
);

CREATE TABLE COMPATIBLE(
                           id_produit INTEGER,
                           id_option INTEGER,
                           PRIMARY KEY(id_produit, id_option),
                           FOREIGN KEY(id_produit) REFERENCES Produit(id_produit) ON UPDATE CASCADE ON DELETE CASCADE,
                           FOREIGN KEY(id_option) REFERENCES Options_Equipement(id_option) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE administrateur (
                                id_admin SERIAL PRIMARY KEY,
                                courriel VARCHAR(255) UNIQUE NOT NULL,
                                mot_de_passe VARCHAR(255) NOT NULL,
                                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Parametres_Site (
                                 id_parametre INTEGER PRIMARY KEY DEFAULT 1,
                                 banniere_active BOOLEAN DEFAULT false,
                                 banniere_texte VARCHAR(255),
                                 telephone VARCHAR(50),
                                 courriel VARCHAR(100),
                                 adresse VARCHAR(255),
                                 copyright_texte VARCHAR(255),
                                 heures_ouverture VARCHAR(255),
                                 lien_facebook VARCHAR(255),
                                 texte_seo TEXT,
                                 CONSTRAINT parametres_single_row CHECK (id_parametre = 1)
);