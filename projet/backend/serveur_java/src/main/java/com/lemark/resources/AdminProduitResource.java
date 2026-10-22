package com.lemark.resources;

import com.lemark.mapper.ProduitSqlMapper;
import com.lemark.modeles.Produit;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin/produits")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
@Transactional
public class AdminProduitResource {

    @Inject
    ProduitSqlMapper produitSqlMapper;

    @POST
    public Response creerProduit(Produit produit) {
        // Le front-end envoie l'ID manuellement, on l'insère tel quel.
        produitSqlMapper.insererProduit(produit);
        return Response.status(Response.Status.CREATED).entity(produit).build();
    }

    @PUT
    @Path("/{id}")
    public Response modifierProduit(@PathParam("id") Integer ancienId, Produit produit) {
        // ancienId = L'ID actuel dans l'URL.
        // produit.idProduit = Le potentiel nouveau ID choisi dans le formulaire.
        produitSqlMapper.modifierProduit(ancienId, produit);
        return Response.ok(produit).build();
    }

    @DELETE
    @Path("/{id}")
    public Response supprimerProduit(@PathParam("id") Integer id) {
        produitSqlMapper.supprimerProduit(id);
        return Response.noContent().build();
    }
}