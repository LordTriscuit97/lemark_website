package com.lemark.mapper;

import com.lemark.modeles.Admin;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface AdminMapper {
    @Select("SELECT id_admin as idAdmin, courriel, mot_de_passe as motDePasse, date_creation as dateCreation " +
            "FROM administrateur WHERE courriel = #{courriel}")
    Admin findByCourriel(String courriel);

    @Select("SELECT id_admin as idAdmin, courriel, date_creation as dateCreation FROM administrateur ORDER BY id_admin ASC")
    List<Admin> getAllAdmins();

    @Insert("INSERT INTO administrateur (courriel, mot_de_passe) VALUES (#{courriel}, #{motDePasse})")
    void insererAdmin(@Param("courriel") String courriel, @Param("motDePasse") String motDePasse);

    // NOUVEAU : Modifier le courriel ET le mot de passe
    @Update("UPDATE administrateur SET courriel = #{courriel}, mot_de_passe = #{motDePasse} WHERE id_admin = #{idAdmin}")
    void modifierAdminComplet(@Param("idAdmin") Integer idAdmin, @Param("courriel") String courriel, @Param("motDePasse") String motDePasse);

    // NOUVEAU : Modifier UNIQUEMENT le courriel (conserver le vieux mot de passe)
    @Update("UPDATE administrateur SET courriel = #{courriel} WHERE id_admin = #{idAdmin}")
    void modifierAdminCourriel(@Param("idAdmin") Integer idAdmin, @Param("courriel") String courriel);

    @Delete("DELETE FROM administrateur WHERE id_admin = #{idAdmin}")
    void supprimerAdmin(Integer idAdmin);
}