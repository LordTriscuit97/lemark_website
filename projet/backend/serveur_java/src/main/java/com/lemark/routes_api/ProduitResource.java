package com.lemark.routes_api;

import com.lemark.modeles.Produit;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/all_produits")
public class ProduitResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Produit> getAllProduits() {
        return Produit.listAll();
    }
}