package com.lemark.resources;

import com.lemark.dto.ModeleDTO;
import com.lemark.mapper.ModeleSqlMapper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin/modeles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
@Transactional // <-- Indispensable pour éviter que Quarkus n'annule la sauvegarde
public class AdminModeleResource {

    @Inject
    ModeleSqlMapper modeleSqlMapper;

    @POST
    public Response creerModele(ModeleDTO req) {
        modeleSqlMapper.insererModele(req.idModele(), req.sku(), req.nomModele(), req.specifications(), req.idProduit());
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}")
    public Response modifierModele(@PathParam("id") Integer ancienId, ModeleDTO req) {
        modeleSqlMapper.modifierModele(ancienId, req.idModele(), req.sku(), req.nomModele(), req.specifications());
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response supprimerModele(@PathParam("id") Integer id) {
        modeleSqlMapper.supprimerModele(id);
        return Response.noContent().build();
    }
}