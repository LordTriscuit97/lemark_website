package com.lemark.modeles;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "Image_Produit")
public class ImageProduit extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_image")
    public int idImage;

    @ManyToOne
    @JoinColumn(name = "id_modele")
    public Modele modele;

    @Column(name = "nom_fichier", nullable = false)
    public String nomFichier;

    @Column(name = "ordre_affichage")
    public Integer ordreAffichage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", nullable = false)
    @JsonIgnore
    public Produit produit;
}