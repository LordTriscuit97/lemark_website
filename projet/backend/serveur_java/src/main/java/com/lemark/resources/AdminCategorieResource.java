package com.lemark.resources;

import com.lemark.mapper.CategorieSqlMapper;
import com.lemark.modeles.Categorie;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
public class AdminCategorieResource {

    @Inject
    CategorieSqlMapper categorieSqlMapper;

    @GET
    public Response lister() {
        return Response.ok(categorieSqlMapper.getAllCategories()).build();
    }

    @POST
    public Response creer(Categorie categorie) {
        categorieSqlMapper.insererCategorie(categorie);
        return Response.status(Response.Status.CREATED).entity(categorie).build();
    }

    @PUT
    @Path("/{id}")
    public Response modifier(@PathParam("id") Integer ancienId, Categorie categorie) {
        categorieSqlMapper.modifierCategorie(ancienId, categorie);
        return Response.ok(categorie).build();
    }

    @DELETE
    @Path("/{id}")
    public Response supprimer(@PathParam("id") Integer id) {
        // La contrainte PostgreSQL "ON DELETE RESTRICT" bloquera automatiquement
        // si un produit utilise cette catégorie (retournera une erreur 500).
        categorieSqlMapper.supprimerCategorie(id);
        return Response.noContent().build();
    }
}