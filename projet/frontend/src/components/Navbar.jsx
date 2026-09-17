import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
    const [dropdownDesktopOuvert, setDropdownDesktopOuvert] = useState(false);
    const [sousMenuMobileOuvert, setSousMenuMobileOuvert] = useState(false);
    const [estScrolle, setEstScrolle] = useState(false);

    // Détection du défilement
    useEffect(() => {
        const gererDefilement = () => {
            if (window.scrollY > 100) {
                setEstScrolle(true);
            } else {
                setEstScrolle(false);
            }
        };

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
            {/* ================= VERSION ORDINATEUR ================= */}
            <div className="d-none d-lg-block header-wrapper-desktop">
                <div className="top-info-bar">
                    <div className="d-flex align-items-center gap-4 fw-bold">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
                            123 Rue de l'Industrie, Sherbrooke, QC
                        </span>
                        <span className="opacity-50">•</span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                            </svg>
                            1-800-555-0199
                        </span>
                        <span className="opacity-50">•</span>
                        <span style={{ color: '#FFB703' }}>
                            Venez voir en personne !
                        </span>
                    </div>
                </div>

                {/* Logo centré horizontalement entre le bord gauche et la barre rouge */}
                <div className="navbar-logo-desktop">
                    <Link to="/" onClick={fermerTout}>
                        <img
                            src="/images/general/logo_seul.png"
                            alt="Les Entreprises Lemark"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/produits/defaut_produit.png';
                            }}
                        />
                    </Link>
                </div>

                {/* Boîte rouge avec menu déroulant */}
                <div className="navbar-red-pill-desktop">
                    <nav className="d-flex align-items-center gap-2">
                        <Link className="nav-pill-link" to="/" onClick={fermerTout}>Accueil</Link>
                        <div className="nav-separator" />

                        {/* Menu Déroulant "Nos Produits" */}
                        <div
                            className="nav-dropdown"
                            onMouseEnter={() => setDropdownDesktopOuvert(true)}
                            onMouseLeave={() => setDropdownDesktopOuvert(false)}
                        >
                            <button
                                type="button"
                                className="nav-pill-link nav-dropdown-btn"
                                onClick={() => setDropdownDesktopOuvert(!dropdownDesktopOuvert)}
                            >
                                <span>Nos Produits</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="ms-1" viewBox="0 0 16 16" style={{ transform: dropdownDesktopOuvert ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>

                            {dropdownDesktopOuvert && (
                                <div className="nav-dropdown-menu">
                                    <Link className="dropdown-item-custom" to="/categorie/1" onClick={fermerTout}>Surfaceuses</Link>
                                    <Link className="dropdown-item-custom" to="/categorie/2" onClick={fermerTout}>Rouleaux & Compacteurs</Link>
                                    <Link className="dropdown-item-custom" to="/categorie/3" onClick={fermerTout}>Débuscage & Foresterie</Link>
                                    <Link className="dropdown-item-custom" to="/categorie/4" onClick={fermerTout}>Remorques</Link>
                                    <Link className="dropdown-item-custom" to="/categorie/5" onClick={fermerTout}>Niveleuses & Herses</Link>
                                    <Link className="dropdown-item-custom" to="/categorie/6" onClick={fermerTout}>Foyers Extérieurs</Link>
                                    <div className="dropdown-divider-custom" />
                                    <Link className="dropdown-item-custom" style={{ color: '#D91D1D' }} to="/catalogue" onClick={fermerTout}>Tout voir</Link>
                                </div>
                            )}
                        </div>

                        <div className="nav-separator" />
                        <Link className="nav-pill-link" to="/nouveautes" onClick={fermerTout}>Nouveautés</Link>
                        <div className="nav-separator" />
                        <Link className="nav-pill-link" to="/histoire" onClick={fermerTout}>Notre Histoire</Link>
                        <div className="nav-separator" />
                        <Link className="nav-pill-link" to="/contact" onClick={fermerTout}>Nous Joindre</Link>
                    </nav>

                    <div className="d-flex align-items-center gap-3">
                        <div className="text-end text-white" style={{ lineHeight: '1.15' }}>
                            <span className="d-block fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.4px', opacity: 0.9 }}>
                                FIÈREMENT CONÇU ET
                            </span>
                            <span className="d-block fw-bolder" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                                FABRIQUÉ AU QUÉBEC
                            </span>
                        </div>
                        <img
                            src="/images/general/quebec_fleur_lys.png"
                            alt="Fleur de lys"
                            style={{ maxHeight: '34px', width: 'auto' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>
                </div>
            </div>

            {/* ================= VERSION MOBILE ================= */}
            <div className="d-lg-none header-wrapper-mobile">
                <div className="mobile-info-strip text-center fw-bold">
                    <div>1-800-555-0199 • <span style={{ color: '#FFB703' }}>Venez voir en personne !</span></div>
                </div>

                <div className="container px-3 py-2 d-flex align-items-center justify-content-between">
                    <Link to="/" onClick={fermerTout}>
                        <img
                            src="/images/general/logo_seul.png"
                            alt="Lemark"
                            style={{ maxHeight: '55px', width: 'auto' }}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/produits/defaut_produit.png';
                            }}
                        />
                    </Link>

                    <button
                        className="btn-hamburger"
                        onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}
                        aria-label="Menu principal"
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                </div>

                {/* Tiroir déroulant fluide */}
                <div className={`mobile-menu-drawer ${menuMobileOuvert ? 'open' : ''}`}>
                    <nav className="d-flex flex-column">
                        <Link className="mobile-nav-link" to="/" onClick={fermerTout}>Accueil</Link>

                        {/* Accordéon mobile pour "Nos Produits" */}
                        <div>
                            <button
                                type="button"
                                className="mobile-nav-link w-100 text-start d-flex justify-content-between align-items-center bg-transparent border-0"
                                onClick={() => setSousMenuMobileOuvert(!sousMenuMobileOuvert)}
                            >
                                <span>Nos Produits</span>
                                <span style={{ fontSize: '1.3rem', lineHeight: '1' }}>{sousMenuMobileOuvert ? '-' : '+'}</span>
                            </button>

                            {sousMenuMobileOuvert && (
                                <div className="mobile-submenu">
                                    <Link className="mobile-submenu-link" to="/categorie/1" onClick={fermerTout}>Surfaceuses</Link>
                                    <Link className="mobile-submenu-link" to="/categorie/2" onClick={fermerTout}>Rouleaux & Compacteurs</Link>
                                    <Link className="mobile-submenu-link" to="/categorie/3" onClick={fermerTout}>Débuscage & Foresterie</Link>
                                    <Link className="mobile-submenu-link" to="/categorie/4" onClick={fermerTout}>Remorques</Link>
                                    <Link className="mobile-submenu-link" to="/categorie/5" onClick={fermerTout}>Niveleuses & Herses</Link>
                                    <Link className="mobile-submenu-link" to="/categorie/6" onClick={fermerTout}>Foyers Extérieurs</Link>
                                    <Link className="mobile-submenu-link fw-bold" style={{ color: '#FFB703' }} to="/catalogue" onClick={fermerTout}>Tout voir</Link>
                                </div>
                            )}
                        </div>

                        <Link className="mobile-nav-link" to="/nouveautes" onClick={fermerTout}>Nouveautés</Link>
                        <Link className="mobile-nav-link" to="/histoire" onClick={fermerTout}>Notre Histoire</Link>
                        <Link className="mobile-nav-link" to="/contact" onClick={fermerTout}>Nous Joindre</Link>
                    </nav>

                    <div className="p-3 d-flex align-items-center justify-content-center gap-3 text-white">
                        <img
                            src="/images/general/quebec_fleur_lys.png"
                            alt="Fleur de lys"
                            style={{ maxHeight: '25px', width: 'auto' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="fw-bold small">Fièrement conçu et fabriqué au Québec</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;