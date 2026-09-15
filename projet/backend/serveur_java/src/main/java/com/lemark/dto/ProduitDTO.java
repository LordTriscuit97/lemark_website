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
        List<ModeleDTO> modeles,
        List<ImageProduitDTO> images
) {}
