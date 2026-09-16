import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <header className="sticky-top bg-white shadow-sm border-bottom">
            {/* Ligne principale : Logo et Contact */}
            <div className="container py-3">
                <div className="row align-items-center justify-content-between">

                    {/* Logo (qui ramène à l'accueil aussi, au cas où) */}
                    <div className="col-auto">
                        <Link className="text-decoration-none fw-bold fs-2" to="/">
                            <span className="text-dark">LE</span><span className="text-lemark-red">MARK</span>
                        </Link>
                    </div>

                    {/* Lien Contact direct (visible sur grand écran) */}
                    <div className="col-auto d-none d-lg-block">
                        <Link to="/contact" className="btn btn-outline-dark fw-bold px-4 py-2">
                            Nous Joindre
                        </Link>
                    </div>

                </div>
            </div>

            {/* Barre secondaire : Catégories en boutons massifs */}
            <div className="bg-lemark-dark py-3 border-top border-3" style={{ borderColor: 'var(--lemark-red)' }}>
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">

                        {/* LE NOUVEAU BOUTON ACCUEIL EXPLICITE */}
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/">
                            Accueil
                        </Link>

                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/catalogue">
                            Tout voir
                        </Link>
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/categorie/1">
                            Surfaceuses
                        </Link>
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/categorie/2">
                            Rouleaux
                        </Link>
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/categorie/3">
                            Débuscage
                        </Link>
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/categorie/4">
                            Remorques
                        </Link>
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/categorie/5">
                            Niveleuses
                        </Link>
                        <Link className="btn btn-outline-light fw-bold px-3 py-2 text-nowrap" to="/categorie/6">
                            Foyers Extérieurs
                        </Link>

                        {/* Bouton Contact mobile */}
                        <Link className="btn btn-danger d-lg-none fw-bold px-3 py-2 text-nowrap" to="/contact" style={{ backgroundColor: 'var(--lemark-red)' }}>
                            Nous Joindre
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;