import { Link } from 'react-router-dom';

function Accueil() {
    const imagesHero = [
        { src: '/images/general/main1.png' },
        { src: '/images/general/main2.png' },
        { src: '/images/general/main3.png' },
        { src: '/images/general/main4.png' }
    ];

    const categories = [
        { id: 1, nom: 'Surfaceuses', path: '/categorie/1', img: '/images/general/thumbnail_remorque.png' },
        { id: 2, nom: 'Rouleaux & Compacteurs', path: '/categorie/2', img: '/images/general/thumbnail_remorque.png' },
        { id: 3, nom: 'Débuscage & Foresterie', path: '/categorie/3', img: '/images/general/thumbnail_remorque.png' },
        { id: 4, nom: 'Remorques', path: '/categorie/4', img: '/images/general/thumbnail_remorque.png' },
        { id: 5, nom: 'Niveleuses & Herses', path: '/categorie/5', img: '/images/general/thumbnail_remorque.png' },
        { id: 6, nom: 'Foyers Extérieurs', path: '/categorie/6', img: '/images/general/thumbnail_remorque.png' }
    ];

    return (
        <div>
            {/* ================= SECTION HÉRO (Acier Brossé / Strié) ================= */}
            <section className="bg-lemark-steel py-5 position-relative border-bottom border-danger border-4">
                <div className="container py-4">
                    <div className="row align-items-center g-5">

                        {/* Colonne de Gauche : Titre et CTA */}
                        <div className="col-lg-6 pe-lg-4">
                            <h1 className="text-white mb-4" style={{ fontSize: '4.5rem', lineHeight: '1', fontFamily: "'Teko', sans-serif" }}>
                                <span className="d-block" style={{ color: 'var(--lemark-red)' }}>LEMARK</span>
                                DES ÉQUIPEMENTS ROBUSTES, CONÇUS POUR TRAVAILLER AUSSI FORT QUE VOUS.
                            </h1>

                            <p className="mb-4" style={{
                                fontFamily: "'Barlow', sans-serif",
                                fontSize: '1.15rem',
                                fontWeight: '700',
                                color: 'rgba(255, 255, 255, 0.85)',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                lineHeight: '1.4'
                            }}>
                                DE LA FORESTERIE AUX FOYERS, LES ENTREPRISES LEMARK FABRIQUENT DES SOLUTIONS DURABLES EN ACIER DE PREMIÈRE QUALITÉ.
                            </p>

                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/catalogue" className="btn-lemark btn-lemark-yellow px-4 py-3 fs-4">
                                    VOIR LES ÉQUIPEMENTS
                                </Link>
                                <Link to="/philosophie" className="btn-lemark btn-lemark-outline px-4 py-3 fs-4">
                                    NOTRE PHILOSOPHIE
                                </Link>
                            </div>
                        </div>

                        {/* Colonne de Droite : Grille de Photos d'Équipements */}
                        <div className="col-lg-6">
                            <div className="hero-island-grid">
                                {imagesHero.map((item, index) => (
                                    <div
                                        key={index}
                                        className="island-photo-card"
                                        style={{
                                            border: '2px solid #0A0A0C',
                                            boxShadow: '6px 6px 0px #0A0A0C',
                                            borderRadius: '0px'
                                        }}
                                    >
                                        <img
                                            src={item.src}
                                            alt={`Équipement Lemark ${index + 1}`}
                                            onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= SECTION PRODUITS / CATÉGORIES (Papier Millimétré) ================= */}
            <section className="bg-lemark-grid py-5">
                <div className="container py-3">

                    {/* En-tête de section avec bordure noire dure */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 border-bottom border-dark border-3 pb-3">
                        <h2 className="m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '3.5rem', fontWeight: '700', lineHeight: '1' }}>
                            <span style={{ color: 'var(--lemark-red)' }}>NOS</span> CATÉGORIES
                        </h2>

                        <Link to="/catalogue" className="btn-lemark btn-lemark-dark px-4 py-2 fs-5">
                            CATALOGUE COMPLET →
                        </Link>
                    </div>

                    {/* Grille de cartes uniformisées (.card-lemark) */}
                    <div className="row g-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="col-12 col-md-6 col-lg-4">
                                <Link to={cat.path} className="card-lemark text-decoration-none">

                                    {/* Liseré Rouge Lemark Supérieur */}
                                    <div className="w-100" style={{ height: '4px', backgroundColor: 'var(--lemark-red)' }}></div>

                                    {/* Cadre Photo Produit */}
                                    <div
                                        className="w-100 position-relative overflow-hidden border-bottom border-dark border-2 p-3 d-flex align-items-center justify-content-center"
                                        style={{ height: '220px', backgroundColor: '#E9ECEF' }}
                                    >
                                        <img
                                            src={cat.img}
                                            alt={cat.nom}
                                            className="img-fluid"
                                            style={{ maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                                            onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                                        />
                                    </div>

                                    {/* Titre et Action de Carte */}
                                    <div className="p-4 d-flex flex-column flex-grow-1">
                                        <h3 className="text-dark m-0 mb-3 text-center" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem', lineHeight: '1.1' }}>
                                            {cat.nom}
                                        </h3>

                                        <div className="w-100 text-center bg-dark text-white fw-bold py-2 mt-auto" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '1px' }}>
                                            EXPLORER LA CATÉGORIE →
                                        </div>
                                    </div>

                                </Link>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
}

export default Accueil;