package com.lemark.dto;

public record OptionEquipementDTO(
        int idOption,
        String nomOption,
        String sku,
        String descriptionOption,
        String nomFichierImage
) {}