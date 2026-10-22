package com.lemark.mapper;

import org.apache.ibatis.annotations.*;

@Mapper
public interface ImageSqlMapper {

    @Insert("INSERT INTO Image_Produit (id_image, id_modele, nom_fichier, ordre_affichage, id_produit) " +
            "VALUES (#{idImage}, #{idModele}, #{nomFichier}, #{ordreAffichage}, #{idProduit})")
    void insererImage(@Param("idImage") Integer idImage, @Param("idModele") Integer idModele,
                      @Param("nomFichier") String nomFichier, @Param("ordreAffichage") Integer ordreAffichage,
                      @Param("idProduit") Integer idProduit);

    // --- LA FONCTION MANQUANTE RÉINTÉGRÉE ---
    @Update("UPDATE Image_Produit SET id_image = #{nouvelId}, id_modele = #{idModele}, " +
            "nom_fichier = #{nomFichier}, ordre_affichage = #{ordreAffichage} WHERE id_image = #{ancienId}")
    void modifierImage(@Param("ancienId") Integer ancienId, @Param("nouvelId") Integer nouvelId,
                       @Param("idModele") Integer idModele, @Param("nomFichier") String nomFichier,
                       @Param("ordreAffichage") Integer ordreAffichage);

    @Delete("DELETE FROM Image_Produit WHERE id_image = #{idImage}")
    void supprimerImage(Integer idImage);
}