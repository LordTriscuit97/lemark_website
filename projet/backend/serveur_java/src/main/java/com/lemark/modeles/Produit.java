package com.lemark.modeles;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.io.Serial;

@Entity
@Table(name = "Produit")
public class Produit extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produit")
    public int idProduit;

    @Column(name = "nom_produit")
    public String nomProduit;

    @Column(name = "description_courte")
    public String descriptionCourte;

    @Column(name = "description_longue")
    public String descriptionLongue;

    @Column(name = "est_nouveaute")
    public Boolean estNouveaute;
}