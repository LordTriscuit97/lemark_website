package com.lemark.resources;

import com.lemark.mapper.OptionSqlMapper;
import com.lemark.modeles.OptionsEquipement;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin/options")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
public class AdminOptionResource {

    @Inject
    OptionSqlMapper optionSqlMapper;

    @GET
    public Response listerOptions() {
        return Response.ok(optionSqlMapper.getAllOptions()).build();
    }

    @POST
    public Response creerOption(OptionsEquipement option) {
        optionSqlMapper.insererOption(option);
        return Response.status(Response.Status.CREATED).entity(option).build();
    }

    @PUT
    @Path("/{id}")
    public Response modifierOption(@PathParam("id") Integer ancienId, OptionsEquipement option) {
        optionSqlMapper.modifierOption(ancienId, option);
        return Response.ok(option).build();
    }

    @DELETE
    @Path("/{id}")
    public Response supprimerOption(@PathParam("id") Integer id) {
        optionSqlMapper.supprimerOption(id);
        return Response.noContent().build();
    }

    // --- Routes pour cocher/décocher la compatibilité ---
    @POST
    @Path("/produit/{idProduit}/lier/{idOption}")
    public Response lier(@PathParam("idProduit") Integer idProduit, @PathParam("idOption") Integer idOption) {
        optionSqlMapper.lierOptionAuProduit(idProduit, idOption);
        return Response.ok().build();
    }

    @DELETE
    @Path("/produit/{idProduit}/retirer/{idOption}")
    public Response retirer(@PathParam("idProduit") Integer idProduit, @PathParam("idOption") Integer idOption) {
        optionSqlMapper.retirerOptionDuProduit(idProduit, idOption);
        return Response.ok().build();
    }
}