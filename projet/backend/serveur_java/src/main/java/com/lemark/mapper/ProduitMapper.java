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
        if (produit == null) {
            return null;
        }

        // 1. Catégorie
        CategorieDTO categorieDTO = null;
        if (produit.categorie != null) {
            categorieDTO = new CategorieDTO(
                    produit.categorie.idCategorie,
                    produit.categorie.nomCategorie
            );
        }

        // 2. Modèles
        var modelesDTO = produit.modeles.stream()
                .map(m -> new ModeleDTO(m.idModele, m.sku, m.nomModele, m.specifications))
                .collect(Collectors.toList());

        // 3. Images
        var imagesDTO = produit.images.stream()
                .map(i -> new ImageProduitDTO(
                        i.idImage,
                        i.nomFichier,
                        i.ordreAffichage,
                        i.modele != null ? i.modele.idModele : null
                ))
                .collect(Collectors.toList());

        // 4. Options d'équipement (NOUVEAU)
        var optionsDTO = produit.options.stream()
                .map(o -> new OptionEquipementDTO(
                        o.idOption,
                        o.nomOption,
                        o.sku,
                        o.descriptionOption,
                        o.nomFichierImage
                ))
                .collect(Collectors.toList());

        // 5. Assemblage
        return new ProduitDTO(
                produit.idProduit,
                produit.nomProduit,
                produit.descriptionCourte,
                produit.descriptionLongue,
                produit.estNouveaute != null ? produit.estNouveaute : false,
                categorieDTO,
                modelesDTO,
                imagesDTO,
                optionsDTO // On injecte les options ici
        );
    }
}