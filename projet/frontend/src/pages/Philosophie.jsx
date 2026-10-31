import { Link } from 'react-router-dom';

function Philosophie() {
    return (
        <div style={{
            backgroundColor: 'var(--lemark-bg-offwhite)',
            backgroundImage: 'linear-gradient(to right, rgba(24, 25, 27, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 25, 27, 0.035) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            minHeight: '100vh',
            paddingBottom: '5rem'
        }}>

            {/* Bandeau d'en-tête technique */}
            <div style={{
                backgroundColor: 'var(--lemark-charcoal)',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '4px solid var(--lemark-red)',
                marginBottom: '4rem'
            }}>
                <div className="container text-start w-100">
                    <h1 className="text-white m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '4.5rem', lineHeight: '1' }}>
                        PHILOSOPHIE
                    </h1>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '960px' }}>

                {/* BLOC PRINCIPAL : Le Manifeste Lemark */}
                <div className="bg-white border border-dark border-2 p-4 p-md-5 mb-4 position-relative" style={{ boxShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>
                    <div className="position-absolute top-0 start-0 h-100" style={{ width: '6px', backgroundColor: 'var(--lemark-red)' }}></div>

                    <h2 className="text-dark mb-4 ps-3" style={{ fontFamily: "'Teko', sans-serif", fontSize: '3rem', lineHeight: '1.1' }}>
                        L'EXIGENCE DU TRAVAIL BIEN FAIT
                    </h2>

                    <div className="ps-3 text-dark" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem', lineHeight: '1.7' }}>
                        <p className="fw-bold mb-4">
                            Les Entreprises Lemark ont été fondées sur un principe simple : concevoir et fabriquer de l'équipement agricole et industriel d'une robustesse irréprochable.
                        </p>
                        <p className="mb-4 text-secondary fw-bold">
                            Face à la prolifération de matériel conçu pour le court terme, nous faisons le choix d'une fabrication axée sur la durabilité. Nous privilégions des standards élevés à chaque étape d'assemblage, sans chercher d'intermédiaires ou de compromis sur la matière première.
                        </p>
                    </div>
                </div>

                {/* BLOC SECONDAIRE : Vision & Rapport Qualité-Prix */}
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div className="bg-white border border-dark border-2 p-4 h-100" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                            <h3 className="text-dark mb-3 border-bottom border-dark border-2 pb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>
                                UN JUSTE RAPPORT QUALITÉ-PRIX
                            </h3>
                            <p className="text-secondary fw-bold m-0" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', lineHeight: '1.6' }}>
                                Pour nous, un bon rapport qualité-prix ne signifie pas réduire la quantité d'acier pour faire baisser une facture. Il s'agit plutôt d'offrir une valeur réelle et constante : un équipement fiable, construit avec des matériaux de premier choix, qui justifie pleinement l'investissement de départ par sa tenue dans le temps.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="bg-white border border-dark border-2 p-4 h-100" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                            <h3 className="text-dark mb-3 border-bottom border-dark border-2 pb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>
                                RIGUEUR & CONSEIL
                            </h3>
                            <p className="text-secondary fw-bold m-0" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', lineHeight: '1.6' }}>
                                La satisfaction de nos clients repose autant sur la qualité de nos machines que sur l'exactitude de nos conseils. Nous prenons le temps d'évaluer chaque besoin avec attention afin de nous assurer que chaque machine quittant l'atelier répond précisément aux contraintes du terrain.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PANNEAU D'ACTION SIMPLE */}
                <div className="p-4 p-md-5 bg-white border border-dark border-2 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4" style={{ boxShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>
                    <div>
                        <h4 className="text-dark m-0 mb-1" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.2rem', lineHeight: '1' }}>
                            DES QUESTIONS SUR NOS ÉQUIPEMENTS ?
                        </h4>
                        <span className="text-secondary fw-bold" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem' }}>
                            Contactez-nous pour échanger sur vos besoins techniques ou valider une compatibilité.
                        </span>
                    </div>
                    <Link to="/contact" className="btn text-white border-0 px-4 py-3 flex-shrink-0" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '0' }}>
                        CONTACTER L'ATELIER
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Philosophie;