package com.lemark.resources;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.lemark.dto.AuthRequest;
import com.lemark.mapper.AdminMapper;
import com.lemark.modeles.Admin; // Note: modeles avec un 's'
import io.smallrye.jwt.build.Jwt;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.Duration;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AdminMapper adminMapper;

    @POST
    @Path("/login")
    public Response login(AuthRequest request) {
        Admin admin = adminMapper.findByCourriel(request.getCourriel());
        if (admin == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"erreur\":\"Courriel ou mot de passe invalide\"}")
                    .build();
        }

        BCrypt.Result verification = BCrypt.verifyer().verify(request.getMotDePasse().toCharArray(), admin.getMotDePasse());

        if (!verification.verified) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"erreur\":\"Courriel ou mot de passe invalide\"}")
                    .build();
        }

        String token = Jwt.issuer("lemark-api")
                .upn(admin.getCourriel())
                .groups("Admin")
                .expiresIn(Duration.ofHours(8))
                .sign();

        return Response.ok("{\"token\":\"" + token + "\"}").build();
    }

    // Outil de génération du hash
    @GET
    @Path("/generer-hash")
    @Produces(MediaType.TEXT_PLAIN)
    public String genererHash(@QueryParam("mdp") String mdp) {
        if (mdp == null || mdp.isBlank()) return "Fournis un ?mdp=TonMotDePasse dans l'URL";
        return BCrypt.withDefaults().hashToString(10, mdp.toCharArray());
    }

    @GET
    @Path("/creer-compte")
    @Produces(MediaType.TEXT_PLAIN)
    public String creerCompte() {
        // Remplace la chaîne ci-dessous par le hash que tu viens de générer
        String monHash = "$2a$10$N02blEwFtKfsKPEy6ubgvOtdMBJVKzWMujxgPZdtMtzpp4m3KXH9y";

        try {
            adminMapper.insererAdmin("kirouacarnaud97@gmail.com", monHash);
            return "Succès : Compte administrateur créé ! Tu peux maintenant te connecter.";
        } catch (Exception e) {
            return "Erreur (le compte existe peut-être déjà) : " + e.getMessage();
        }
    }
}