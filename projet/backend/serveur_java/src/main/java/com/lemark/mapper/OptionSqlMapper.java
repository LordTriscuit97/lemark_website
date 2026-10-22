package com.lemark.mapper;

import com.lemark.modeles.OptionsEquipement;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface OptionSqlMapper {

    @Select("SELECT id_option as idOption, nom_option as nomOption, sku, description_option as descriptionOption, nom_fichier_image as nomFichierImage " +
            "FROM options_equipement ORDER BY id_option ASC")
    List<OptionsEquipement> getAllOptions();

    @Insert("INSERT INTO options_equipement (id_option, nom_option, sku, description_option) " +
            "VALUES (#{idOption}, #{nomOption}, #{sku}, #{descriptionOption})")
    void insererOption(OptionsEquipement option);

    @Update("UPDATE options_equipement SET " +
            "id_option = #{o.idOption}, " +
            "nom_option = #{o.nomOption}, " +
            "sku = #{o.sku}, " +
            "description_option = #{o.descriptionOption} " +
            "WHERE id_option = #{ancienId}")
    void modifierOption(@Param("ancienId") Integer ancienId, @Param("o") OptionsEquipement option);

    @Delete("DELETE FROM options_equipement WHERE id_option = #{idOption}")
    void supprimerOption(Integer idOption);

    // --- Gestion instantanée de la compatibilité ---
    @Insert("INSERT INTO COMPATIBLE (id_produit, id_option) VALUES (#{idProduit}, #{idOption})")
    void lierOptionAuProduit(@Param("idProduit") Integer idProduit, @Param("idOption") Integer idOption);

    @Delete("DELETE FROM COMPATIBLE WHERE id_produit = #{idProduit} AND id_option = #{idOption}")
    void retirerOptionDuProduit(@Param("idProduit") Integer idProduit, @Param("idOption") Integer idOption);
}
