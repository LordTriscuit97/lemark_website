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
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', backgroundColor: 'var(--lemark-bg-offwhite)' }}>
                <h2 className="text-dark" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem' }}>CHARGEMENT DES ÉQUIPEMENTS...</h2>
            </div>
        );
    }

    if (erreur) {
        return (
            <div className="py-5" style={{ backgroundColor: 'var(--lemark-bg-offwhite)', minHeight: '60vh' }}>
                <div className="container">
                    <div className="bg-white border border-danger border-2 p-4 text-center shadow-sm rounded-0">
                        <span className="fw-bold d-block mb-1 text-danger" style={{ fontFamily: "'Barlow', sans-serif" }}>ERREUR DE COMMUNICATION AVEC L'INVENTAIRE</span>
                        <span style={{ fontFamily: "'Barlow', sans-serif" }}>{erreur}</span>
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
        : "TOUS LES ÉQUIPEMENTS";

    return (
        <div style={{
            backgroundColor: 'var(--lemark-bg-offwhite)',
            backgroundImage: 'linear-gradient(to right, rgba(24, 25, 27, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 25, 27, 0.035) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            minHeight: '100vh',
            paddingBottom: '5rem'
        }}>

            {/* Bandeau d'en-tête technique : Hauteur fixe et centrage vertical absolu, alignement à gauche */}
            <div style={{
                backgroundColor: 'var(--lemark-charcoal)',
                height: '240px', /* Hauteur fixe pour ancrer le titre */
                display: 'flex',
                alignItems: 'center', /* Centrage vertical Flexbox */
                borderBottom: '4px solid var(--lemark-red)',
                marginBottom: '3rem'
            }}>
                <div className="container text-start w-100">
                    <h1 className="text-white m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '4.5rem', lineHeight: '1' }}>
                        {titrePage}
                    </h1>
                </div>
            </div>

            <div className="container">
                {produitsFiltres.length === 0 ? (
                    <div className="bg-white border border-2 border-dark p-5 text-center shadow-sm" style={{ borderRadius: '0' }}>
                        <h3 className="text-dark mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem' }}>AUCUN ÉQUIPEMENT RÉPERTORIÉ</h3>
                        <p className="text-secondary mb-4 fw-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            AUCUN PRODUIT N'EST ACTUELLEMENT DISPONIBLE DANS CETTE CATÉGORIE.
                        </p>
                        <Link to="/catalogue" className="btn-outline-light-sq text-dark border-dark" style={{ fontSize: '1.2rem' }}>
                            VOIR L'INVENTAIRE COMPLET
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
                                    <Link to={`/produit/${produit.idProduit}`} className="text-decoration-none d-flex flex-column h-100 bg-white border border-dark border-2 position-relative" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease', borderRadius: '0' }}
                                          onMouseEnter={(e) => {
                                              e.currentTarget.style.transform = 'translate(-2px, -2px)';
                                              e.currentTarget.style.boxShadow = '6px 6px 0px rgba(217, 29, 29, 1)';
                                          }}
                                          onMouseLeave={(e) => {
                                              e.currentTarget.style.transform = 'translate(0, 0)';
                                              e.currentTarget.style.boxShadow = 'none';
                                          }}
                                    >

                                        {/* Liseré Rouge Supérieur */}
                                        <div className="w-100" style={{ height: '4px', backgroundColor: 'var(--lemark-red)' }}></div>

                                        {/* Cadre photo - Image en mode "fill" (cover) avec pastilles superposées */}
                                        <div className="w-100 position-relative overflow-hidden border-bottom border-dark border-2" style={{ height: '240px', backgroundColor: '#E9ECEF' }}>

                                            {/* Badges superposés (Overlay) avec index-z pour passer au-dessus de l'image */}
                                            <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between pointer-events-none" style={{ zIndex: 2 }}>
                                                {produit.options && produit.options.length > 0 ? (
                                                    <span className="text-dark px-2 py-1 fw-bold border border-dark shadow-sm" style={{ backgroundColor: 'var(--lemark-yellow)', fontFamily: "'Teko', sans-serif", fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                                                        OPTIONS DISPONIBLES
                                                    </span>
                                                ) : <span></span>}

                                                {produit.estNouveaute && (
                                                    <span className="text-white px-2 py-1 fw-bold border border-white shadow-sm" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                                                        NOUVEAUTÉ
                                                    </span>
                                                )}
                                            </div>

                                            <img
                                                src={imageUrl}
                                                alt={produit.nomProduit}
                                                className="w-100 h-100 position-absolute top-0 start-0"
                                                style={{ objectFit: 'cover', zIndex: 1 }}
                                                onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                                            />
                                        </div>

                                        {/* Corps de la carte (Sans description) */}
                                        <div className="p-4 d-flex flex-column flex-grow-1">
                                            {!idCategorie && produit.categorie && (
                                                <span className="text-danger fw-bold d-block mb-1" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {produit.categorie.nomCategorie}
                                                </span>
                                            )}

                                            <h2 className="text-dark m-0 mb-4" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem', lineHeight: '1.1' }}>
                                                {produit.nomProduit}
                                            </h2>

                                            {/* Bouton d'action franc aligné au bas */}
                                            <div className="w-100 text-center bg-dark text-white fw-bold py-2 mt-auto" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
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

export default Catalogue;