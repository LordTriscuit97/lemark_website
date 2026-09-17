import { Link } from 'react-router-dom';

function Accueil() {
    const imagesHero = [
        { src: '/images/general/main1.png', anim: 'float-island-1' },
        { src: '/images/general/main2.png', anim: 'float-island-2' },
        { src: '/images/general/main3.png', anim: 'float-island-3' },
        { src: '/images/general/main4.png', anim: 'float-island-4' }
    ];

    const categories = [
        { id: 1, nom: 'Surfaceuses', path: '/categorie/1' },
        { id: 2, nom: 'Rouleaux & Compacteurs', path: '/categorie/2' },
        { id: 3, nom: 'Débuscage & Foresterie', path: '/categorie/3' },
        { id: 4, nom: 'Remorques', path: '/categorie/4' },
        { id: 5, nom: 'Niveleuses & Herses', path: '/categorie/5' },
        { id: 6, nom: 'Foyers Extérieurs', path: '/categorie/6' }
    ];

    return (
        <div>
            {/* ================= SECTION HÉRO ================= */}
            <section className="hero-fullwidth-steel">
                <div className="container">
                    <div className="row align-items-center g-5">

                        <div className="col-lg-6 pe-lg-4">
                            <h1 className="display-4 fw-bolder mb-4 text-white" style={{ lineHeight: '1.15' }}>
                                <span className="d-block mb-2" style={{ letterSpacing: '1.5px' }}>
                                    <span style={{ color: 'var(--lemark-red)' }}>L</span>EMAR<span style={{ color: 'var(--lemark-red)' }}>K</span>,
                                </span>
                                Des équipements robustes, conçus pour travailler <span style={{ color: 'var(--lemark-red)' }}>aussi fort que vous.</span>
                            </h1>

                            <p className="fs-5 mb-5" style={{ lineHeight: '1.65', color: '#B4B8C2' }}>
                                De la foresterie à l'entretien de sentiers, les Entreprises Lemark fabriquent des solutions durables en acier de qualité supérieure. Simple d'utilisation, impossible à casser.
                            </p>

                            <div>
                                <Link to="/catalogue" className="btn btn-yellow-pill text-decoration-none me-3 mb-2">
                                    Voir les équipements
                                </Link>
                                <Link to="/histoire" className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold mb-2">
                                    Notre savoir-faire
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="hero-island-grid">
                                {imagesHero.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`island-photo-card ${item.anim}`}
                                    >
                                        <img
                                            src={item.src}
                                            alt={`Équipement Lemark ${index + 1}`}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/images/produits/defaut_produit.png';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= SECTION PRODUITS (TÔLE LARMÉE) ================= */}
            <section className="section-categories">
                <div className="container">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                        <div className="section-header-industrial">
                            <h2 className="section-title-industrial">
                                Nos <span>Produits</span>
                            </h2>
                        </div>

                        <Link to="/catalogue" className="btn-catalogue-link d-inline-flex align-items-center gap-2 mt-3 mt-md-0">
                            <span>Catalogue complet</span>
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>

                    <div className="category-pill-grid">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={cat.path}
                                className="category-pill-blend"
                            >
                                <span className="rivet rivet-tl" />
                                <span className="rivet rivet-tr" />
                                <span className="rivet rivet-bl" />
                                <span className="rivet rivet-br" />

                                <div className="category-pill-blend-thumb">
                                    <img
                                        src="/images/general/thumbnail_remorque.png"
                                        alt={cat.nom}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = '/images/produits/defaut_produit.png';
                                        }}
                                    />
                                </div>

                                <div className="category-pill-blend-divider" />

                                <div className="category-pill-blend-content">
                                    <span className="category-pill-blend-title">{cat.nom}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
}

export default Accueil;