package com.lemark.resources;

import com.lemark.mapper.ImageSqlMapper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Path("/api/admin/images")
@RolesAllowed("Admin")
public class AdminImageResource {

    @Inject
    ImageSqlMapper imageSqlMapper;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploaderImage(
            @RestForm("idImage") Integer idImage,
            @RestForm("idModele") Integer idModele,
            @RestForm("ordreAffichage") Integer ordreAffichage,
            @RestForm("idProduit") Integer idProduit,
            @RestForm("fichier") FileUpload fichier
    ) {
        try {
            if (fichier == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("{\"erreur\":\"Aucun fichier reçu\"}").build();
            }

            String nomFichier = fichier.fileName();

            java.nio.file.Path dossierDestination = Paths.get(System.getProperty("user.dir"), "..", "..", "frontend", "public", "images", "produits").normalize();

            if (!Files.exists(dossierDestination)) {
                Files.createDirectories(dossierDestination);
            }

            java.nio.file.Path cheminFinal = dossierDestination.resolve(nomFichier);

            Files.copy(fichier.uploadedFile(), cheminFinal, StandardCopyOption.REPLACE_EXISTING);

            imageSqlMapper.insererImage(idImage, idModele, nomFichier, ordreAffichage, idProduit);

            return Response.ok("{\"message\":\"Image téléversée avec succès\"}").build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erreur\":\"Erreur lors de l'upload : " + e.getMessage() + "\"}").build();
        }
    }

    // --- LA ROUTE MANQUANTE RÉINTÉGRÉE ---
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response modifierImage(
            @PathParam("id") Integer ancienId,
            @RestForm("idImage") Integer nouvelId,
            @RestForm("idModele") Integer idModele,
            @RestForm("ordreAffichage") Integer ordreAffichage,
            @RestForm("nomFichier") String nomFichier,
            @RestForm("fichier") FileUpload fichier
    ) {
        try {
            String nomFichierFinal = nomFichier;

            // S'il y a un nouveau fichier uploadé, on l'écrase
            if (fichier != null) {
                nomFichierFinal = fichier.fileName();
                java.nio.file.Path dossierDestination = Paths.get(System.getProperty("user.dir"), "..", "..", "frontend", "public", "images", "produits").normalize();
                if (!Files.exists(dossierDestination)) Files.createDirectories(dossierDestination);
                java.nio.file.Path cheminFinal = dossierDestination.resolve(nomFichierFinal);
                Files.copy(fichier.uploadedFile(), cheminFinal, StandardCopyOption.REPLACE_EXISTING);
            }

            imageSqlMapper.modifierImage(ancienId, nouvelId, idModele, nomFichierFinal, ordreAffichage);
            return Response.ok("{\"message\":\"Image modifiée avec succès\"}").build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"erreur\":\"Erreur lors de la modification : " + e.getMessage() + "\"}").build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response supprimerImage(@PathParam("id") Integer id) {
        imageSqlMapper.supprimerImage(id);
        return Response.noContent().build();
    }
}