package com.lemark.routes_api;

import com.lemark.dto.ProduitDTO;
import com.lemark.service.ProduitService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/all_produits")
@Produces(MediaType.APPLICATION_JSON)
public class ProduitResource {

    @Inject
    ProduitService produitService;

    @GET
    public List<ProduitDTO> listAll() {
        return produitService.getAllProduits();
    }
}