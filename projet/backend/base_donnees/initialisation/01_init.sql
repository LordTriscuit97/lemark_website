CREATE TABLE Categorie(
                          id_categorie SERIAL,
                          nom_categorie VARCHAR(50) ,
                          PRIMARY KEY(id_categorie)
);

CREATE TABLE Produit(
                        id_produit SERIAL,
                        nom_produit VARCHAR(50) ,
                        description_courte VARCHAR(50) ,
                        description_longue VARCHAR(50) ,
                        est_nouveaute BOOLEAN,
                        id_categorie INTEGER NOT NULL,
                        PRIMARY KEY(id_produit),
                        FOREIGN KEY(id_categorie) REFERENCES Categorie(id_categorie)
);

CREATE TABLE Image_Produit(
                              id_image SERIAL,
                              nom_fichier VARCHAR(50) ,
                              ordre_affichage INTEGER,
                              id_produit INTEGER NOT NULL,
                              PRIMARY KEY(id_image),
                              FOREIGN KEY(id_produit) REFERENCES Produit(id_produit)
);

CREATE TABLE Modele(
                       id_modele SERIAL,
                       sku VARCHAR(50) ,
                       nom_modele VARCHAR(50) ,
                       specifications VARCHAR(50) ,
                       id_produit INTEGER NOT NULL,
                       PRIMARY KEY(id_modele),
                       FOREIGN KEY(id_produit) REFERENCES Produit(id_produit)
);

CREATE TABLE Options_Equipement(
                                   id_option SERIAL,
                                   nom_option VARCHAR(50) ,
                                   sku VARCHAR(50) ,
                                   description_option VARCHAR(50) ,
                                   PRIMARY KEY(id_option)
);

CREATE TABLE COMPATIBLE(
                           id_produit INTEGER,
                           id_option INTEGER,
                           PRIMARY KEY(id_produit, id_option),
                           FOREIGN KEY(id_produit) REFERENCES Produit(id_produit),
                           FOREIGN KEY(id_option) REFERENCES Options_Equipement(id_option)
);
