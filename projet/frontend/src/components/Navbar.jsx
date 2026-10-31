import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
    const [dropdownDesktopOuvert, setDropdownDesktopOuvert] = useState(false);
    const [sousMenuMobileOuvert, setSousMenuMobileOuvert] = useState(false);
    const [estScrolle, setEstScrolle] = useState(false);

    const [banniere, setBanniere] = useState({ active: false, texte: '' });
    const [categories, setCategories] = useState([]);
    const [banniereFermee, setBanniereFermee] = useState(false);
    const [banniereEnFermeture, setBanniereEnFermeture] = useState(false);

    const handleFermerBanniere = () => {
        setBanniereEnFermeture(true);
        setTimeout(() => setBanniereFermee(true), 300);
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/parametres')
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setBanniere({ active: data.banniereActive, texte: data.banniereTexte }); })
            .catch(() => console.log("Bannière injoignable"));

        fetch('http://localhost:8080/api/admin/categories')
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setCategories(Array.isArray(data) ? data : []); })
            .catch(() => console.log("Catégories injoignables"));

        const gererDefilement = () => setEstScrolle(window.scrollY > 50);
        window.addEventListener('scroll', gererDefilement);
        return () => window.removeEventListener('scroll', gererDefilement);
    }, []);

    const fermerTout = () => {
        setMenuMobileOuvert(false);
        setDropdownDesktopOuvert(false);
        setSousMenuMobileOuvert(false);
    };

    return (
        <header className={`sticky-navbar ${estScrolle ? 'header-scrolled' : ''}`}>

            {/* ================= BANNIÈRE D'ALERTE ================= */}
            {banniere.active && banniere.texte && !banniereFermee && (
                <div
                    className="bg-danger text-white px-3 position-relative d-flex align-items-center justify-content-center"
                    style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease-in-out',
                        maxHeight: banniereEnFermeture ? '0px' : '60px',
                        paddingTop: banniereEnFermeture ? '0px' : '0.6rem',
                        paddingBottom: banniereEnFermeture ? '0px' : '0.6rem',
                        opacity: banniereEnFermeture ? 0 : 1,
                        overflow: 'hidden'
                    }}
                >
                    <span className="text-center me-4">{banniere.texte}</span>
                    <button
                        onClick={handleFermerBanniere}
                        className="banner-close-btn position-absolute end-0 top-50 translate-middle-y bg-transparent text-white me-3"
                        aria-label="Fermer la bannière"
                    >
                        <span style={{ fontSize: '1.4rem', lineHeight: '1', position: 'relative', top: '-1px' }}>×</span>
                    </button>
                </div>
            )}

            {/* ================= VERSION ORDINATEUR ================= */}
            <div className="d-none d-lg-block header-wrapper-desktop">

                {/* Info Bar Centrée */}
                <div className="top-info-bar position-relative">
                    <span>1295 7e Rang de Wendover Nord, Saint-Cyrille-de-Wendover, QC</span>
                    <span className="mx-3 opacity-50">|</span>
                    <span>(819) 388-4921</span>
                    <span className="mx-3 opacity-50">|</span>
                    <span style={{ color: 'var(--lemark-yellow)' }}>Prenez rendez-vous et venez voir en personne!</span>

                    {/* Accès Admin à droite */}
                    <Link to="/admin" className="text-secondary position-absolute end-0 me-4" title="Accès Système">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    </Link>
                </div>

                {/* Navbar pleine largeur */}
                <div className="navbar-main-content">
                    <Link to="/" onClick={fermerTout} className="navbar-logo-desktop">
                        <img src="/images/general/logo.png" alt="Les Entreprises Lemark" />
                    </Link>

                    <nav className="nav-links-container">
                        <Link className="nav-pill-link" to="/" onClick={fermerTout}>Accueil</Link>

                        <div className="position-relative" onMouseEnter={() => setDropdownDesktopOuvert(true)} onMouseLeave={() => setDropdownDesktopOuvert(false)}>
                            <button type="button" className="nav-pill-link bg-transparent border-0 d-flex align-items-center" onClick={() => setDropdownDesktopOuvert(!dropdownDesktopOuvert)}>
                                Nos Produits ▾
                            </button>
                            {dropdownDesktopOuvert && (
                                <div className="position-absolute bg-white border border-dark rounded-0 p-2 shadow-lg" style={{ top: '100%', left: 0, minWidth: '220px', zIndex: 1000 }}>
                                    {categories.map(cat => (
                                        <Link key={cat.idCategorie} className="d-block text-dark text-decoration-none fw-bold p-2 text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem' }} to={`/categorie/${cat.idCategorie}`} onClick={fermerTout}>
                                            {cat.nomCategorie}
                                        </Link>
                                    ))}
                                    <hr className="my-1"/>
                                    <Link className="d-block text-danger text-decoration-none fw-bold p-2 text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem' }} to="/catalogue" onClick={fermerTout}>Tout voir</Link>
                                </div>
                            )}
                        </div>

                        <Link className="nav-pill-link" to="/nouveautes" onClick={fermerTout}>Nouveautés</Link>
                        <Link className="nav-pill-link" to="/histoire" onClick={fermerTout}>Notre Histoire</Link>
                        <Link className="nav-pill-link" to="/contact" onClick={fermerTout}>Nous Joindre</Link>
                    </nav>

                    <div className="d-flex align-items-center gap-2 text-white text-end" style={{ fontFamily: "'Teko', sans-serif" }}>
                        <div style={{ lineHeight: '1.1' }}>
                            <span className="d-block text-white-50" style={{ fontSize: '1rem' }}>FIÈREMENT CONÇU ET</span>
                            <span className="d-block text-white" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>FABRIQUÉ AU QUÉBEC</span>
                        </div>
                        <img src="/images/general/quebec_fleur_lys.png" alt="Fleur de lys" style={{ maxHeight: '30px' }} />
                    </div>
                </div>
            </div>

            {/* ================= VERSION MOBILE ================= */}
            <div className="d-lg-none header-wrapper-mobile">
                <div className="bg-dark text-white-50 text-center py-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                    1-800-555-0199 • <span className="text-warning">Prenez rendez-vous et venez voir en personne!</span>
                </div>

                <div className="container px-3 py-2 d-flex align-items-center justify-content-between">
                    <Link to="/" onClick={fermerTout}>
                        <img src="/images/general/logo.png" alt="Lemark" style={{ maxHeight: '40px' }} />
                    </Link>

                    <div className="d-flex align-items-center gap-3">
                        <Link to="/admin" className="text-secondary" onClick={fermerTout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                        </Link>
                        <button className="btn-hamburger" onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}>
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                        </button>
                    </div>
                </div>

                {menuMobileOuvert && (
                    <div className="bg-dark p-3 border-top border-danger border-2">
                        <Link className="d-block text-white text-decoration-none fw-bold py-2 border-bottom border-secondary" to="/" onClick={fermerTout}>ACCUEIL</Link>
                        <div className="py-2 border-bottom border-secondary">
                            <button className="w-100 text-start bg-transparent border-0 text-white fw-bold d-flex justify-content-between p-0" onClick={() => setSousMenuMobileOuvert(!sousMenuMobileOuvert)}>
                                NOS PRODUITS <span>{sousMenuMobileOuvert ? '-' : '+'}</span>
                            </button>
                            {sousMenuMobileOuvert && (
                                <div className="ms-3 mt-2 border-start border-warning border-2 ps-3">
                                    {categories.map(cat => (
                                        <Link key={cat.idCategorie} className="d-block text-white-50 text-decoration-none py-1" to={`/categorie/${cat.idCategorie}`} onClick={fermerTout}>{cat.nomCategorie}</Link>
                                    ))}
                                    <Link className="d-block text-warning text-decoration-none py-1 fw-bold" to="/catalogue" onClick={fermerTout}>TOUT VOIR</Link>
                                </div>
                            )}
                        </div>
                        <Link className="d-block text-white text-decoration-none fw-bold py-2 border-bottom border-secondary" to="/nouveautes" onClick={fermerTout}>NOUVEAUTÉS</Link>
                        <Link className="d-block text-white text-decoration-none fw-bold py-2 border-bottom border-secondary" to="/histoire" onClick={fermerTout}>NOTRE HISTOIRE</Link>
                        <Link className="d-block text-white text-decoration-none fw-bold py-2" to="/contact" onClick={fermerTout}>NOUS JOINDRE</Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;