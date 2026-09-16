import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Ajout de useParams

function Catalogue() {
    const { idCategorie } = useParams(); // Récupère le ID de la catégorie dans l'URL (si présent)
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

    if (chargement) return <div className="container py-5 text-center fs-4 fw-bold">Chargement des équipements...</div>;
    if (erreur) return <div className="container py-5 text-center text-danger fs-4">Erreur : {erreur}</div>;

    // LE FILTRE INTELLIGENT :
    // Si on a un idCategorie dans l'URL, on garde juste ces produits. Sinon, on garde tout.
    const produitsFiltres = idCategorie
        ? produits.filter(p => p.categorie && p.categorie.idCategorie.toString() === idCategorie)
        : produits;

    // Pour afficher le bon titre de la page
    const titrePage = idCategorie && produitsFiltres.length > 0
        ? produitsFiltres[0].categorie.nomCategorie.toUpperCase()
        : "TOUT NOTRE CATALOGUE";

    return (
        <div className="container py-5">
            <h1 className="fw-bolder mb-5 text-center">{titrePage}</h1>

            {/* Si la catégorie est vide, on affiche un message rassurant */}
            {produitsFiltres.length === 0 ? (
                <div className="alert alert-secondary text-center fs-5 py-4">
                    Aucun équipement disponible dans cette catégorie pour le moment.
                </div>
            ) : (
                <div className="row g-5">
                    {produitsFiltres.map(produit => {
                        const imageUrl = produit.images && produit.images.length > 0
                            ? `/images/produits/${produit.images[0].nomFichier}`
                            : '/images/produits/defaut_produit.png';

                        return (
                            <div key={produit.idProduit} className="col-12 col-md-6 col-lg-4">
                                <Link to={`/produit/${produit.idProduit}`} className="text-decoration-none text-dark">
                                    <div className="card h-100 shadow-sm border-2 transition-hover">
                                        <div className="bg-light p-3 text-center border-bottom position-relative" style={{ height: '250px' }}>

                                            {/* Pastille Nouveauté (Vert) */}
                                            {produit.estNouveaute && (
                                                <span className="badge bg-success position-absolute top-0 end-0 m-2 p-2 fs-6 shadow-sm z-1">
                                                    Nouveauté
                                                </span>
                                            )}

                                            {/* Pastille Options (Noir) */}
                                            {produit.options && produit.options.length > 0 && (
                                                <span className="badge bg-dark position-absolute top-0 start-0 m-2 p-2 fs-6 shadow-sm z-1">
                                                    Options disponibles
                                                </span>
                                            )}

                                            <img
                                                src={imageUrl}
                                                className="img-fluid h-100 object-fit-contain"
                                                alt={produit.nomProduit}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = '/images/produits/defaut_produit.png';
                                                }}
                                            />
                                        </div>
                                        <div className="card-body text-center p-4">
                                            {!idCategorie && produit.categorie && (
                                                <span className="text-lemark-red fw-bold text-uppercase small mb-2 d-block">
                                                    {produit.categorie.nomCategorie}
                                                </span>
                                            )}
                                            <h2 className="h4 fw-bold mb-3">{produit.nomProduit}</h2>
                                            <p className="text-secondary mb-4">{produit.descriptionCourte}</p>
                                            <div className="btn btn-lemark w-100">Voir les détails</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Catalogue;