package com.lemark.modeles;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "Modele")
public class Modele extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modele")
    public int idModele;

    @Column(name = "sku")
    public String sku;

    @Column(name = "nom_modele", nullable = false)
    public String nomModele;

    @Column(name = "specifications")
    public String specifications;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", nullable = false)
    @JsonIgnore
    public Produit produit;
}