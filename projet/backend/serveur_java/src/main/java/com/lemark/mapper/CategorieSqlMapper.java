package com.lemark.mapper;

import com.lemark.modeles.Categorie;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface CategorieSqlMapper {
    @Select("SELECT id_categorie as idCategorie, nom_categorie as nomCategorie FROM Categorie ORDER BY id_categorie ASC")
    List<Categorie> getAllCategories();

    @Insert("INSERT INTO Categorie (id_categorie, nom_categorie) VALUES (#{idCategorie}, #{nomCategorie})")
    void insererCategorie(Categorie categorie);

    @Update("UPDATE Categorie SET id_categorie = #{c.idCategorie}, nom_categorie = #{c.nomCategorie} WHERE id_categorie = #{ancienId}")
    void modifierCategorie(@Param("ancienId") Integer ancienId, @Param("c") Categorie categorie);

    @Delete("DELETE FROM Categorie WHERE id_categorie = #{idCategorie}")
    void supprimerCategorie(Integer idCategorie);
}