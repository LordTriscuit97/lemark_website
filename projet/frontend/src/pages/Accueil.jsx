import { Link } from 'react-router-dom';

function Accueil() {
    return (
        <div>
            {/* Section Héro : Impact visuel immédiat */}
            <section className="bg-lemark-dark text-white py-5 py-md-5 px-3">
                <div className="container py-5 my-5">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <h1 className="display-4 fw-bolder mb-4">
                                DES ÉQUIPEMENTS DE VTT <span className="text-lemark-red">BÂTIS POUR DURER.</span>
                            </h1>
                            <p className="lead mb-5 fs-4 text-light">
                                Ne perdez plus de temps avec de la machinerie fragile. Nos surfaceuses et remorques industrielles sont conçues pour accomplir le travail lourd, année après année.
                            </p>
                            <div className="d-grid gap-3 d-sm-flex">
                                <Link to="/catalogue" className="btn btn-lemark btn-lg px-5 py-3">Voir le catalogue</Link>
                                <a href="tel:18005550199" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold">Appeler un expert</a>
                            </div>
                        </div>
                        <div className="col-lg-5 mt-5 mt-lg-0 text-center">
                            {/* Espace pour une grosse image d'équipement en action */}
                            <div className="bg-secondary rounded shadow-lg d-flex align-items-center justify-content-center" style={{height: '400px'}}>
                                <span className="text-white fw-bold fs-4">[Photo d'une surfaceuse en pleine action]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section À Propos : La "Bullshit" corporative qui vend la qualité */}
            <section className="py-5 bg-white">
                <div className="container py-5">
                    <div className="row justify-content-center text-center mb-5">
                        <div className="col-lg-8">
                            <h2 className="fw-bolder mb-3">À Propos de Lemark</h2>
                            <div className="mx-auto bg-lemark-red mb-4" style={{height: '4px', width: '80px'}}></div>
                            <p className="fs-5 text-secondary">
                                Fondée sur des principes de rigueur et d'ingénierie supérieure, Les Entreprises Lemark redéfinissent les standards de l'industrie des accessoires de VTT. Chaque pièce d'équipement qui quitte notre usine est le résultat de tests exhaustifs et d'un savoir-faire intransigeant. Nous n'utilisons que des aciers de première qualité et des procédés d'assemblage éprouvés. Quand vous achetez Lemark, vous investissez dans la tranquillité d'esprit et la performance brute.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4 mt-4 text-center">
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100 bg-light">
                                <h3 className="h4 fw-bold text-lemark-red mb-3">Fabrication Robuste</h3>
                                <p className="mb-0 fs-5 text-secondary">Des soudures industrielles et des matériaux sélectionnés pour résister aux pires conditions météorologiques.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100 bg-light">
                                <h3 className="h4 fw-bold text-lemark-red mb-3">Design Intuitif</h3>
                                <p className="mb-0 fs-5 text-secondary">Aucune installation complexe. Nos équipements s'attachent rapidement et opèrent sans faille.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100 bg-light">
                                <h3 className="h4 fw-bold text-lemark-red mb-3">Support Direct</h3>
                                <p className="mb-0 fs-5 text-secondary">Un doute sur les dimensions ? Notre équipe technique répond au téléphone immédiatement.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Accueil;