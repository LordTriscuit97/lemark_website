import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Nouveautes() {
    const [produits, setProduits] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        fetch('/api/all_produits')
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
            <div className="bg-lemark-grid d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <h2 className="text-dark" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem' }}>CHARGEMENT DES NOUVEAUTÉS...</h2>
            </div>
        );
    }

    if (erreur) {
        return (
            <div className="bg-lemark-grid py-5" style={{ minHeight: '60vh' }}>
                <div className="container">
                    <div className="bg-white border border-danger border-2 p-4 text-center shadow-sm">
                        <span className="fw-bold d-block mb-1 text-danger" style={{ fontFamily: "'Barlow', sans-serif" }}>ERREUR DE COMMUNICATION AVEC L'INVENTAIRE</span>
                        <span style={{ fontFamily: "'Barlow', sans-serif" }}>{erreur}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Filtrage exclusif des produits marqués comme nouveauté
    const produitsNouveaux = produits.filter(p => p.estNouveaute);

    return (
        <div className="bg-lemark-grid" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>

            {/* En-tête technique simple et direct sur fond acier brossé */}
            <div
                className="bg-lemark-steel"
                style={{
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '4px solid var(--lemark-red)',
                    marginBottom: '3.5rem'
                }}
            >
                <div className="container text-start w-100">
                    <h1 className="text-white m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '4.5rem', lineHeight: '1', letterSpacing: '1px' }}>
                        NOUVEAUTÉS
                    </h1>
                </div>
            </div>

            <div className="container">
                {produitsNouveaux.length === 0 ? (
                    <div className="bg-white border border-2 border-dark p-5 text-center shadow-sm">
                        <h3 className="text-dark mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem' }}>AUCUNE NOUVEAUTÉ ACTUELLEMENT</h3>
                        <p className="text-secondary mb-4 fw-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            TOUS NOS ÉQUIPEMENTS SONT RÉPERTORIÉS DANS LE CATALOGUE PRINCIPAL.
                        </p>
                        <Link to="/catalogue" className="btn-lemark btn-lemark-yellow px-4 py-2 fs-5">
                            VOIR L'INVENTAIRE COMPLET
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {produitsNouveaux.map(produit => {
                            const imageUrl = produit.images && produit.images.length > 0
                                ? `/images/produits/${produit.images[0].nomFichier}`
                                : '/images/produits/defaut_produit.png';

                            return (
                                <div key={produit.idProduit} className="col-12 col-md-6 col-lg-4">
                                    <Link to={`/produit/${produit.idProduit}`} className="card-lemark">

                                        {/* Liseré Rouge Supérieur */}
                                        <div className="w-100" style={{ height: '4px', backgroundColor: 'var(--lemark-red)' }}></div>

                                        {/* Cadre photo en mode cover (fill) avec pastilles superposées */}
                                        <div className="w-100 position-relative overflow-hidden border-bottom border-dark border-2" style={{ height: '240px', backgroundColor: '#E9ECEF' }}>

                                            {/* Badges superposés */}
                                            <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between pointer-events-none" style={{ zIndex: 2 }}>
                                                {produit.options && produit.options.length > 0 ? (
                                                    <span className="text-dark px-2 py-1 fw-bold border border-dark shadow-sm" style={{ backgroundColor: 'var(--lemark-yellow)', fontFamily: "'Teko', sans-serif", fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                                                        OPTIONS DISPONIBLES
                                                    </span>
                                                ) : <span></span>}

                                                <span className="text-white px-2 py-1 fw-bold border border-white shadow-sm" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                                                    NOUVEAUTÉ
                                                </span>
                                            </div>

                                            <img
                                                src={imageUrl}
                                                alt={produit.nomProduit}
                                                className="w-100 h-100 position-absolute top-0 start-0"
                                                style={{ objectFit: 'cover', zIndex: 1 }}
                                                onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                                            />
                                        </div>

                                        {/* Corps de la carte */}
                                        <div className="p-4 d-flex flex-column flex-grow-1">
                                            {produit.categorie && (
                                                <span className="text-danger fw-bold d-block mb-1" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {produit.categorie.nomCategorie}
                                                </span>
                                            )}

                                            <h2 className="text-dark m-0 mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem', lineHeight: '1.1' }}>
                                                {produit.nomProduit}
                                            </h2>

                                            {/* Description courte */}
                                            {produit.descriptionCourte && (
                                                <p className="text-secondary mb-4 flex-grow-1" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', lineHeight: '1.4' }}>
                                                    {produit.descriptionCourte}
                                                </p>
                                            )}

                                            {/* Bouton d'action au bas de la carte */}
                                            <div className="w-100 text-center btn-lemark btn-lemark-dark py-2 mt-auto fs-5">
                                                VOIR LES DÉTAILS →
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

export default Nouveautes;