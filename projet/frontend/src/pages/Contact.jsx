function Contact() {
    return (
        <div style={{
            backgroundColor: 'var(--lemark-bg-offwhite)',
            backgroundImage: 'linear-gradient(to right, rgba(24, 25, 27, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 25, 27, 0.035) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            minHeight: '100vh',
            paddingBottom: '5rem'
        }}>

            {/* Bandeau d'en-tête technique - Brut */}
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
                        NOUS JOINDRE
                    </h1>
                </div>
            </div>

            <div className="container">
                <div className="row g-4">

                    {/* COLONNE GAUCHE : Téléphone & Courriel */}
                    <div className="col-lg-6 d-flex flex-column gap-4">

                        {/* PANNEAU TÉLÉPHONE - Chiffres massifs et espacés pour copie manuelle */}
                        <div className="p-4 p-md-5" style={{ backgroundColor: 'var(--lemark-red)', boxShadow: '6px 6px 0px rgba(0,0,0,0.2)' }}>
                            <h2 className="text-white mb-3" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}>
                                TÉLÉPHONE
                            </h2>
                            <div className="bg-white border border-dark border-3 d-flex align-items-center justify-content-center py-4 mb-4 user-select-all">
                                <span className="text-dark fw-bold" style={{ fontFamily: "'Teko', sans-serif", fontSize: '4.5rem', lineHeight: '1', letterSpacing: '3px' }}>
                                    (819) 818-4921
                                </span>
                            </div>
                        </div>

                        {/* PANNEAU COURRIEL */}
                        <div className="p-4 p-md-5" style={{ backgroundColor: 'var(--lemark-charcoal)', borderLeft: '6px solid var(--lemark-yellow)', boxShadow: '6px 6px 0px rgba(0,0,0,0.2)' }}>
                            <h2 className="text-white mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}>
                                COURRIEL
                            </h2>
                            <div className="py-2 mb-3 user-select-all">
                                <span style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.7rem', color: 'var(--lemark-yellow)', lineHeight: '1', letterSpacing: '1px', wordBreak: 'break-all' }}>
                                    INFO@LESENTREPRISESLEMARK.COM
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* COLONNE DROITE : Adresse de l'atelier */}
                    <div className="col-lg-6">
                        <div className="bg-white border border-dark border-2 p-4 p-md-5 h-100" style={{ boxShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>
                            <h2 className="text-dark mb-5 border-bottom border-dark border-2 pb-3" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}>
                                NOTRE ATELIER
                            </h2>

                            {/* ADRESSE PHYSIQUE */}
                            <div className="mb-5">
                                <h3 className="text-danger mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.8rem', letterSpacing: '1px' }}>
                                    ADRESSE
                                </h3>
                                <span className="fw-bold text-dark d-block mb-1" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.2rem', lineHeight: '1.1' }}>
                                    LES ENTREPRISES LEMARK
                                </span>
                                <span className="text-secondary fw-bold d-block user-select-all" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.3rem', lineHeight: '1.5' }}>
                                    1295 7e Rang de Wendover Nord<br/>
                                    Saint-Cyrille-de-Wendover, QC<br/>
                                    J1Z 1N3
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Contact;