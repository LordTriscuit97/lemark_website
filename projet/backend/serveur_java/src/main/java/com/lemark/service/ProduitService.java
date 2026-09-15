package com.lemark.service;

import com.lemark.modeles.Produit;
import com.lemark.dto.ProduitDTO;
import com.lemark.mapper.ProduitMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProduitService {

    @Inject
    ProduitMapper mapper;

     @Transactional
    public List<ProduitDTO> getAllProduits() {
        List<Produit> produits = Produit.listAll();

        return produits.stream()
                .map(p->mapper.toDTO(p))
                .collect(Collectors.toList());
    }
}
