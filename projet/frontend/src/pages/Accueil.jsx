import { Link } from 'react-router-dom';

function Accueil() {
    const imagesHero = [
        { src: '/images/general/main1.png', anim: 'float-island-1' },
        { src: '/images/general/main2.png', anim: 'float-island-2' },
        { src: '/images/general/main3.png', anim: 'float-island-3' },
        { src: '/images/general/main4.png', anim: 'float-island-4' }
    ];

    return (
        <div className="pb-5">
            {/* Section Héro : Pleine largeur bord en bord & Acier texturé lourd */}
            <section className="hero-fullwidth-steel">
                <div className="container">
                    <div className="row align-items-center g-5">

                        {/* Colonne Texte & Appel à l'action */}
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bolder mb-4 text-white" style={{ lineHeight: '1.15' }}>
                                <span className="d-block mb-2" style={{ letterSpacing: '1.5px' }}>
                                    <span style={{ color: '#D91D1D' }}>L</span>EMAR<span style={{ color: '#D91D1D' }}>K</span>,
                                </span>
                                Des équipements robustes, conçus pour travailler <span style={{ color: '#D91D1D' }}>aussi fort que vous.</span>
                            </h1>

                            <p className="fs-4 mb-5" style={{ lineHeight: '1.6', color: '#B4B8C2' }}>
                                De la foresterie à l'entretien de sentiers, les Entreprises Lemark fabriquent des solutions durables en acier de qualité supérieure. Simple d'utilisation, impossible à casser.
                            </p>

                            <div>
                                <Link to="/histoire" className="btn btn-yellow-pill text-decoration-none">
                                    En savoir plus sur Lemark
                                </Link>
                            </div>
                        </div>

                        {/* Colonne Îlot des 4 photos animées */}
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

            {/* Section Catégories */}
            <section className="container pt-5">
                <h2 className="fw-bolder mb-5 text-center fs-1">Nos Catégories</h2>

                <div className="row g-4 justify-content-center">
                    {/* Tuile 1 */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <Link to="/categorie/1" className="text-decoration-none text-dark">
                            <div className="card-lemark h-100 p-4 text-center">
                                <div className="bg-lemark-bg-offwhite rounded-4 mb-3 d-flex align-items-center justify-content-center" style={{height: '180px'}}>
                                    <img src="/images/produits/defaut_produit.png" alt="Surfaceuses" className="img-fluid" style={{maxHeight: '140px'}} />
                                </div>
                                <h3 className="h4 fw-bold mb-0">Surfaceuses</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Tuile 2 */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <Link to="/categorie/4" className="text-decoration-none text-dark">
                            <div className="card-lemark h-100 p-4 text-center">
                                <div className="bg-lemark-bg-offwhite rounded-4 mb-3 d-flex align-items-center justify-content-center" style={{height: '180px'}}>
                                    <img src="/images/produits/defaut_produit.png" alt="Remorques" className="img-fluid" style={{maxHeight: '140px'}} />
                                </div>
                                <h3 className="h4 fw-bold mb-0">Remorques</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Tuile 3 */}
                    <div className="col-12 col-sm-6 col-lg-4">
                        <Link to="/categorie/6" className="text-decoration-none text-dark">
                            <div className="card-lemark h-100 p-4 text-center">
                                <div className="bg-lemark-bg-offwhite rounded-4 mb-3 d-flex align-items-center justify-content-center" style={{height: '180px'}}>
                                    <img src="/images/produits/defaut_produit.png" alt="Foyers Extérieurs" className="img-fluid" style={{maxHeight: '140px'}} />
                                </div>
                                <h3 className="h4 fw-bold mb-0">Foyers Extérieurs</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Bouton pour tout voir */}
                    <div className="col-12 text-center mt-5">
                        <Link to="/catalogue" className="btn btn-outline-dark fw-bold rounded-pill px-5 py-3 fs-5 hover-lift">
                            Parcourir tous les équipements
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Accueil;