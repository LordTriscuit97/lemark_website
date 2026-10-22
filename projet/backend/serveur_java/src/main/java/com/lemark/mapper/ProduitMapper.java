package com.lemark.mapper;

import com.lemark.dto.ProduitDTO;
import com.lemark.dto.ModeleDTO;
import com.lemark.dto.ImageProduitDTO;
import com.lemark.dto.CategorieDTO;
import com.lemark.dto.OptionEquipementDTO;
import com.lemark.modeles.Produit;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProduitMapper {

    public ProduitDTO toDTO(Produit produit) {
        if (produit == null) return null;

        // 1. Catégorie
        CategorieDTO categorieDTO = null;
        if (produit.categorie != null) {
            categorieDTO = new CategorieDTO(produit.categorie.idCategorie, produit.categorie.nomCategorie);
        }

        // 2. Modèles (CORRECTION ICI : On ajoute produit.idProduit comme 5e paramètre)
        var modelesDTO = produit.modeles.stream()
                .map(m -> new ModeleDTO(m.idModele, m.sku, m.nomModele, m.specifications, produit.idProduit))
                .collect(Collectors.toList());

        // 3. Images
        var imagesDTO = produit.images.stream()
                .map(i -> {
                    int idModeleLie = 0;

                    // On récupère le modèle si l'image y est associée
                    if (i.modele != null) {
                        idModeleLie = i.modele.idModele;
                    }

                    int ordre = i.ordreAffichage != null ? i.ordreAffichage : 1;

                    return new ImageProduitDTO(i.idImage, i.nomFichier, ordre, idModeleLie);
                })
                .collect(Collectors.toList());

        // 4. Options
        var optionsDTO = produit.options.stream()
                .map(o -> new OptionEquipementDTO(o.idOption, o.nomOption, o.sku, o.descriptionOption, o.nomFichierImage))
                .collect(Collectors.toList());

        return new ProduitDTO(
                produit.idProduit, produit.nomProduit, produit.descriptionCourte, produit.descriptionLongue,
                produit.estNouveaute != null ? produit.estNouveaute : false,
                categorieDTO, modelesDTO, imagesDTO, optionsDTO
        );
    }
}