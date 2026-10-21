package com.lemark.mapper;

import com.lemark.modeles.Admin;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminMapper {
    @Select("SELECT id_admin as idAdmin, courriel, mot_de_passe as motDePasse, date_creation as dateCreation " +
            "FROM administrateur WHERE courriel = #{courriel}")
    Admin findByCourriel(String courriel);

    @Insert("INSERT INTO administrateur (courriel, mot_de_passe) VALUES (#{courriel}, #{motDePasse})")
    void creerCompte(@Param("courriel") String courriel, @Param("motDePasse") String motDePasse);
}