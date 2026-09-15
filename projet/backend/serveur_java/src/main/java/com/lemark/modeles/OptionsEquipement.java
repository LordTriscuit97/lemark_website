package com.lemark.modeles;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "Options_Equipement")
public class OptionsEquipement extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_option")
    public int idOption;

    @Column(name = "nom_option", nullable = false)
    public String nomOption;

    @Column(name = "sku")
    public String sku;

    @Column(name = "description_option")
    public String descriptionOption;

    @Column(name = "nom_fichier_image")
    public String nomFichierImage;
}