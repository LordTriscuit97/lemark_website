import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [dropdownDesktopOuvert, setDropdownDesktopOuvert] = useState(false);
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
        setDropdownDesktopOuvert(false);
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

            {/* ================= BARRE DU HAUT ET NAVBAR PC ================= */}
            <div className="header-wrapper-desktop">

                {/* Info Bar Centrée */}
                <div className="top-info-bar position-relative">
                    <span>1295 7e Rang de Wendover Nord, Saint-Cyrille-de-Wendover, QC</span>
                    <span className="mx-3 opacity-50">|</span>
                    <span>(819) 818-4921</span>
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
                        <img src="/images/general/logo.png" alt="Les Entreprises Lemark" onError={(e) => { e.currentTarget.src = '/images/general/logo.png'; }} />
                    </Link>

                    <nav className="nav-links-container">
                        <Link className="nav-pill-link" to="/" onClick={fermerTout}>Accueil</Link>

                        <div className="position-relative" onMouseEnter={() => setDropdownDesktopOuvert(true)} onMouseLeave={() => setDropdownDesktopOuvert(false)}>
                            <button type="button" className="nav-pill-link" onClick={() => setDropdownDesktopOuvert(!dropdownDesktopOuvert)}>
                                Nos Produits ▾
                            </button>
                            {dropdownDesktopOuvert && (
                                <div
                                    className="position-absolute bg-white border border-dark border-2 rounded-0 p-0"
                                    style={{
                                        top: '100%',
                                        left: 0,
                                        minWidth: '250px',
                                        zIndex: 1000,
                                        boxShadow: '6px 6px 0px rgba(0,0,0,0.9)'
                                    }}
                                >
                                    {categories.length > 0 ? (
                                        categories.map(cat => (
                                            <Link
                                                key={cat.idCategorie}
                                                className="dropdown-item-lemark border-bottom border-light"
                                                to={`/categorie/${cat.idCategorie}`}
                                                onClick={fermerTout}
                                            >
                                                {cat.nomCategorie}
                                            </Link>
                                        ))
                                    ) : (
                                        <>
                                            <Link className="dropdown-item-lemark border-bottom border-light" to="/categorie/1" onClick={fermerTout}>Surfaceuses</Link>
                                            <Link className="dropdown-item-lemark border-bottom border-light" to="/categorie/2" onClick={fermerTout}>Rouleaux & Compacteurs</Link>
                                            <Link className="dropdown-item-lemark border-bottom border-light" to="/categorie/3" onClick={fermerTout}>Débuscage & Foresterie</Link>
                                            <Link className="dropdown-item-lemark border-bottom border-light" to="/categorie/4" onClick={fermerTout}>Remorques</Link>
                                            <Link className="dropdown-item-lemark border-bottom border-light" to="/categorie/5" onClick={fermerTout}>Niveleuses & Herses</Link>
                                            <Link className="dropdown-item-lemark" to="/categorie/6" onClick={fermerTout}>Foyers Extérieurs</Link>
                                        </>
                                    )}
                                    <div className="border-top border-dark border-2" />
                                    <Link className="btn-lemark btn-lemark-yellow w-100 text-center text-decoration-none py-2 fs-5" to="/catalogue" onClick={fermerTout}>
                                        TOUT LE CATALOGUE →
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link className="nav-pill-link" to="/nouveautes" onClick={fermerTout}>Nouveautés</Link>
                        <Link className="nav-pill-link" to="/philosophie" onClick={fermerTout}>Notre Philosophie</Link>
                        <Link className="nav-pill-link" to="/contact" onClick={fermerTout}>Nous Joindre</Link>
                    </nav>

                    <div className="d-flex align-items-center gap-2 text-white text-end" style={{ fontFamily: "'Teko', sans-serif" }}>
                        <div style={{ lineHeight: '1.1' }}>
                            <span className="d-block text-white-50" style={{ fontSize: '1rem' }}>FIÈREMENT CONÇU ET</span>
                            <span className="d-block text-white" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>FABRIQUÉ AU QUÉBEC</span>
                        </div>
                        <img src="/images/general/quebec_fleur_lys.png" alt="Fleur de lys" style={{ maxHeight: '30px' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;