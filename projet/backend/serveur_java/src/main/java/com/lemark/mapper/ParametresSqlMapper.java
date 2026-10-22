package com.lemark.mapper;

import com.lemark.modeles.ParametresSite;
import org.apache.ibatis.annotations.*;

@Mapper
public interface ParametresSqlMapper {
    @Select("SELECT id_parametre as idParametre, banniere_active as banniereActive, banniere_texte as banniereTexte, telephone, courriel, adresse, copyright_texte as copyrightTexte, heures_ouverture as heuresOuverture, lien_facebook as lienFacebook, texte_seo as texteSeo FROM Parametres_Site WHERE id_parametre = 1")
    ParametresSite getParametres();

    @Update("UPDATE Parametres_Site SET banniere_active = #{banniereActive}, banniere_texte = #{banniereTexte}, telephone = #{telephone}, courriel = #{courriel}, adresse = #{adresse}, copyright_texte = #{copyrightTexte}, heures_ouverture = #{heuresOuverture}, lien_facebook = #{lienFacebook}, texte_seo = #{texteSeo} WHERE id_parametre = 1")
    void modifierParametres(ParametresSite params);
}