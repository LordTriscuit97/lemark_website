package com.lemark.mapper;

import com.lemark.modeles.Produit;
import org.apache.ibatis.annotations.*;

@Mapper
public interface ProduitSqlMapper {

    // 1. AJOUT : On force l'insertion du id_produit fourni manuellement
    @Insert("INSERT INTO produit (id_produit, nom_produit, description_courte, description_longue, est_nouveaute, id_categorie) " +
            "VALUES (#{idProduit}, #{nomProduit}, #{descriptionCourte}, #{descriptionLongue}, #{estNouveaute}, #{categorie.idCategorie})")
    void insererProduit(Produit produit);

    // 2. MODIFICATION : On change l'ID en se basant sur l'ancien ID
    @Update("UPDATE produit SET " +
            "id_produit = #{p.idProduit}, " +
            "nom_produit = #{p.nomProduit}, " +
            "description_courte = #{p.descriptionCourte}, " +
            "description_longue = #{p.descriptionLongue}, " +
            "est_nouveaute = #{p.estNouveaute}, " +
            "id_categorie = #{p.categorie.idCategorie} " +
            "WHERE id_produit = #{ancienId}")
    void modifierProduit(@Param("ancienId") Integer ancienId, @Param("p") Produit produit);

    // 3. SUPPRESSION
    @Delete("DELETE FROM produit WHERE id_produit = #{idProduit}")
    void supprimerProduit(Integer idProduit);
}