package com.lemark.resources;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.lemark.mapper.AdminMapper;
import com.lemark.modeles.Admin;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin/comptes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
public class AdminCompteResource {

    @Inject
    AdminMapper adminMapper;

    @GET
    public Response lister() {
        return Response.ok(adminMapper.getAllAdmins()).build();
    }

    @POST
    public Response creer(Admin admin) {
        if (admin.getMotDePasse() == null || admin.getMotDePasse().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Le mot de passe est requis").build();
        }

        String hash = BCrypt.withDefaults().hashToString(10, admin.getMotDePasse().toCharArray());

        try {
            adminMapper.insererAdmin(admin.getCourriel(), hash);
            return Response.status(Response.Status.CREATED).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Ce courriel est peut-être déjà utilisé.").build();
        }
    }

    // NOUVEAU : Route de modification
    @PUT
    @Path("/{id}")
    public Response modifier(@PathParam("id") Integer id, Admin admin) {
        try {
            if (admin.getMotDePasse() != null && !admin.getMotDePasse().isBlank()) {
                // S'il y a un nouveau mot de passe, on le crypte et on met tout à jour
                String hash = BCrypt.withDefaults().hashToString(10, admin.getMotDePasse().toCharArray());
                adminMapper.modifierAdminComplet(id, admin.getCourriel(), hash);
            } else {
                // Sinon on ne touche qu'au courriel
                adminMapper.modifierAdminCourriel(id, admin.getCourriel());
            }
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erreur : Ce courriel appartient peut-être déjà à un autre compte.").build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response supprimer(@PathParam("id") Integer id) {
        adminMapper.supprimerAdmin(id);
        return Response.noContent().build();
    }
}