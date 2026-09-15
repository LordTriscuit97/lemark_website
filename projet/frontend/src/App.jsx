import { useState, useEffect } from 'react';

function App() {
    const [produits, setProduits] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/all_produits')
            .then(res => {
                if (!res.ok) throw new Error('Erreur réseau lors de la récupération');
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

    if (chargement) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Chargement du catalogue...</p>
        </div>
    );

    if (erreur) return (
        <div className="container mt-5">
            <div className="alert alert-danger">Erreur : {erreur}</div>
        </div>
    );

    return (
        <div className="container my-5">
            <h1 className="text-center mb-5">Catalogue d'équipements</h1>

            <div className="row g-4">
                {produits.map(produit => {
                    const imageSource = produit.images && produit.images.length > 0
                        ? `/images/produits/${produit.images[0].nomFichier}`
                        : '/images/placeholders/defaut-produit.png';

                    return (
                        <div key={produit.idProduit} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm">

                                <div className="position-relative bg-light" style={{ height: '220px' }}>
                                    {produit.estNouveaute && (
                                        <span className="badge bg-success position-absolute top-0 end-0 m-2 z-1">
                      Nouveauté
                    </span>
                                    )}
                                    <img
                                        src={imageSource}
                                        className="card-img-top w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        alt={produit.nomProduit}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = '/images/placeholders/defaut-produit.png';
                                        }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column">
                  <span className="text-uppercase text-muted small fw-bold mb-1">
                    {produit.categorie?.nomCategorie}
                  </span>
                                    <h5 className="card-title">{produit.nomProduit}</h5>
                                    <p className="card-text text-secondary small mb-4">
                                        {produit.descriptionCourte}
                                    </p>

                                    <div className="mt-auto">
                                        <strong className="d-block small mb-2 text-dark">Modèles :</strong>
                                        <div className="d-flex flex-wrap gap-1">
                                            {produit.modeles?.map(m => (
                                                <span key={m.idModele} className="badge bg-secondary">
                          {m.sku}
                        </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;