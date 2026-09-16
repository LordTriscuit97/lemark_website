package com.lemark.dto;

import com.lemark.modeles.ImageProduit;
import com.lemark.modeles.Modele;

import java.util.List;

public record ProduitDTO(
        int idProduit,
        String nomProduit,
        String descriptionCourte,
        String descriptionLongue,
        boolean estNouveaute,
        CategorieDTO categorie,
        List<ModeleDTO> modeles,
        List<ImageProduitDTO> images,
        List<OptionEquipementDTO> options
) {}
