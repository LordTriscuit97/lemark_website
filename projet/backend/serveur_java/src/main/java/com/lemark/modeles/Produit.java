package com.lemark.modeles;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Produit")
public class Produit extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produit")
    public int idProduit;

    @Column(name = "nom_produit", nullable = false)
    public String nomProduit;

    @Column(name = "description_courte")
    public String descriptionCourte;

    @Column(name = "description_longue")
    public String descriptionLongue;

    @Column(name = "est_nouveaute")
    public Boolean estNouveaute;

    @ManyToOne
    @JoinColumn(name = "id_categorie", nullable = false)
    public Categorie categorie;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Modele> modeles = new ArrayList<>();

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ImageProduit> images = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "compatible",
            joinColumns = @JoinColumn(name = "id_produit"),
            inverseJoinColumns = @JoinColumn(name = "id_option")
    )
    public List<OptionsEquipement> options = new ArrayList<>();
}