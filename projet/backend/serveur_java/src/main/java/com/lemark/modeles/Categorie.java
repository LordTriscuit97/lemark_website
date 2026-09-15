package com.lemark.modeles;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "Categorie")
public class Categorie extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categorie")
    public int idCategorie;

    @Column(name = "nom_categorie", nullable = false)
    public String nomCategorie;
}