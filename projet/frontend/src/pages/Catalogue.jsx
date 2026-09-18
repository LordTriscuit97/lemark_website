import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function Catalogue() {
    const { idCategorie } = useParams();
    const [produits, setProduits] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/all_produits')
            .then(res => {
                if (!res.ok) throw new Error('Erreur réseau');
                return res.json();
            })
            .then(data => {
                setProduits(data);
                setChargement(false);
            })
            .catch(err => {
                setErreur(err.message);
                setChargement(false);
            });
    }, []);

    if (chargement) {
        return (
            <div className="catalog-wrapper d-flex align-items-center justify-content-center py-5">
                <div className="text-center">
                    <h2 className="fw-bolder text-dark">Chargement des équipements...</h2>
                </div>
            </div>
        );
    }

    if (erreur) {
        return (
            <div className="catalog-wrapper py-5">
                <div className="container">
                    <div className="alert alert-danger border-2 p-4 text-center">
                        <span className="fw-bold d-block mb-1">Erreur de communication avec l'inventaire</span>
                        <span>{erreur}</span>
                    </div>
                </div>
            </div>
        );
    }

    const produitsFiltres = idCategorie
        ? produits.filter(p => p.categorie && p.categorie.idCategorie.toString() === idCategorie)
        : produits;

    const titrePage = idCategorie && produitsFiltres.length > 0
        ? produitsFiltres[0].categorie.nomCategorie
        : "Tous les équipements";

    const sousTitre = idCategorie
        ? "Équipements spécialisés en acier québécois, conçus pour affronter les conditions les plus rudes."
        : "Fabrication robuste en acier de qualité supérieure. Des solutions durables pour vos travaux forestiers et d'entretien.";

    return (
        <div className="catalog-wrapper">

            {/* Bandeau d'en-tête technique collé sous la navbar */}
            <div className="catalog-header-bar">
                <div className="container">
                    <h1 className="catalog-header-title">
                        {titrePage}
                    </h1>
                    <p className="catalog-header-subtitle mb-0">
                        {sousTitre}
                    </p>
                </div>
            </div>

            <div className="container">
                {produitsFiltres.length === 0 ? (
                    <div className="bg-white border rounded-3 p-5 text-center shadow-sm">
                        <h3 className="fw-bold text-dark mb-2">Aucun équipement répertorié</h3>
                        <p className="text-secondary mb-4">
                            Aucun produit n'est actuellement disponible dans cette catégorie.
                        </p>
                        <Link to="/catalogue" className="btn btn-outline-dark fw-bold rounded-pill px-4 py-2">
                            Voir l'inventaire complet
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {produitsFiltres.map(produit => {
                            const imageUrl = produit.images && produit.images.length > 0
                                ? `/images/produits/${produit.images[0].nomFichier}`
                                : '/images/produits/defaut_produit.png';

                            return (
                                <div key={produit.idProduit} className="col-12 col-md-6 col-lg-4">
                                    <Link to={`/produit/${produit.idProduit}`} className="text-decoration-none">
                                        <div className="catalog-card-industrial">

                                            {/* Cadre photo mécanique avec badges d'atelier */}
                                            <div className="catalog-img-frame">
                                                {produit.estNouveaute && (
                                                    <span className="badge-tech badge-tech-new">
                                                        Nouveauté
                                                    </span>
                                                )}

                                                {produit.options && produit.options.length > 0 && (
                                                    <span className="badge-tech badge-tech-options">
                                                        Options disponibles
                                                    </span>
                                                )}

                                                <img
                                                    src={imageUrl}
                                                    alt={produit.nomProduit}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = '/images/produits/defaut_produit.png';
                                                    }}
                                                />
                                            </div>

                                            {/* Détails et bouton d'action sobre */}
                                            <div className="catalog-card-body">
                                                {!idCategorie && produit.categorie && (
                                                    <span className="catalog-card-category">
                                                        {produit.categorie.nomCategorie}
                                                    </span>
                                                )}

                                                <h2 className="catalog-card-title">
                                                    {produit.nomProduit}
                                                </h2>

                                                <p className="catalog-card-desc">
                                                    {produit.descriptionCourte}
                                                </p>

                                                <div className="btn-catalog-action">
                                                    <span>Voir les détails</span>
                                                    <span aria-hidden="true">&rarr;</span>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
}

export default Catalogue;