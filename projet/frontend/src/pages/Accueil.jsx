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
            {/* ================= SECTION HÉRO ================= */}
            <section className="hero-fullwidth-steel">
                <div className="container">
                    <div className="row align-items-center g-5">

                        <div className="col-lg-6 pe-lg-4">
                            <h1 className="text-white mb-4" style={{ fontSize: '5rem', lineHeight: '0.9' }}>
                                <span className="d-block" style={{ color: 'var(--lemark-red)' }}>LEMARK</span>
                                DES ÉQUIPEMENTS ROBUSTES, CONÇUS POUR TRAVAILLER AUSSI FORT QUE VOUS.
                            </h1>

                            <p className="fs-5 mb-5 fw-bold" style={{ color: '#B4B8C2' }}>
                                De la foresterie aux foyers, les Entreprises Lemark fabriquent des solutions durables en acier de qualité supérieure.
                            </p>

                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/catalogue" className="btn-yellow-pill">
                                    VOIR LES ÉQUIPEMENTS
                                </Link>
                                <Link to="/histoire" className="btn-outline-light-sq">
                                    NOTRE SAVOIR-FAIRE
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="hero-island-grid">
                                {imagesHero.map((item, index) => (
                                    <div key={index} className="island-photo-card">
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

            {/* ================= SECTION PRODUITS (CARTES BRUTES) ================= */}
            <section className="section-categories">
                <div className="container">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 border-bottom border-dark pb-3">
                        <h2 className="section-title-industrial m-0">
                            <span style={{ color: 'var(--lemark-red)' }}>NOS</span> PRODUITS
                        </h2>

                        <Link to="/catalogue" className="text-dark fw-bold text-uppercase text-decoration-none d-flex align-items-center gap-2" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem' }}>
                            Catalogue complet <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>

                    <div className="category-pill-grid">
                        {categories.map((cat) => (
                            <Link key={cat.id} to={cat.path} className="category-card-brut">
                                <div className="category-card-img">
                                    <img
                                        src={cat.img}
                                        alt={cat.nom}
                                        onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                                    />
                                </div>
                                <div className="category-card-title-box">
                                    <h3 className="category-card-title">{cat.nom}</h3>
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