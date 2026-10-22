package com.lemark.resources;

import com.lemark.mapper.ParametresSqlMapper;
import com.lemark.modeles.ParametresSite;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admin/parametres")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("Admin")
public class AdminParametresResource {

    @Inject
    ParametresSqlMapper parametresSqlMapper;

    @GET
    public Response getParametres() {
        return Response.ok(parametresSqlMapper.getParametres()).build();
    }

    @PUT
    public Response modifierParametres(ParametresSite params) {
        parametresSqlMapper.modifierParametres(params);
        return Response.ok(params).build();
    }
}