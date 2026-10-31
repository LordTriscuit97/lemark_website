package com.lemark.mapper;

import org.apache.ibatis.annotations.*;

@Mapper
public interface ModeleSqlMapper {

    @Insert("INSERT INTO Modele (sku, nom_modele, specifications, id_produit) " +
            "VALUES (#{sku}, #{nomModele}, #{specifications}, #{idProduit})")
    void insererModele(@Param("sku") String sku,
                       @Param("nomModele") String nomModele, @Param("specifications") String specifications,
                       @Param("idProduit") Integer idProduit);

    @Update("UPDATE Modele SET id_modele = #{nouvelId}, sku = #{sku}, nom_modele = #{nomModele}, " +
            "specifications = #{specifications} WHERE id_modele = #{ancienId}")
    void modifierModele(@Param("ancienId") Integer ancienId, @Param("nouvelId") Integer nouvelId,
                        @Param("sku") String sku, @Param("nomModele") String nomModele,
                        @Param("specifications") String specifications);

    @Delete("DELETE FROM Modele WHERE id_modele = #{idModele}")
    void supprimerModele(Integer idModele);
}
