package com.lemark.mapper;

import com.lemark.dto.ImageProduitDTO;
import com.lemark.dto.ModeleDTO;
import com.lemark.dto.ProduitDTO;
import com.lemark.modeles.Produit;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.stream.Collectors;

@ApplicationScoped
public class ProduitMapper {

    public ProduitDTO toDTO(Produit produit) {
        // 1. Traduire la liste des modèles
        var modelesDTO = produit.modeles.stream()
                .map(m -> new ModeleDTO(
                        m.idModele,
                        m.sku,
                        m.nomModele,
                        m.specifications
                ))
                .collect(Collectors.toList());

        // 2. Traduire la liste des images
        var imagesDTO = produit.images.stream()
                .map(i -> new ImageProduitDTO(
                        i.idImage,
                        i.nomFichier,
                        i.ordreAffichage,
                        i.modele.idModele
                ))
                .collect(Collectors.toList());

        // 3. Assembler le produit final
        return new ProduitDTO(
                produit.idProduit,
                produit.nomProduit,
                produit.descriptionCourte,
                produit.descriptionLongue,
                produit.estNouveaute,
                modelesDTO,
                imagesDTO
        );
    }

}


