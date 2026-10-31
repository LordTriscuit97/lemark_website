import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProduitDetail() {
    const { id } = useParams();
    const [produit, setProduit] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [modalImage, setModalImage] = useState(null);
    const [descComplete, setDescComplete] = useState(false);
    const [afficherOptions, setAfficherOptions] = useState(false);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    const LIMITE_CARACTERES = 175;

    useEffect(() => {
        fetch('http://localhost:8080/api/all_produits')
            .then(res => {
                if (!res.ok) throw new Error('Erreur réseau');
                return res.json();
            })
            .then(data => {
                const produitTrouve = data.find(p => p.idProduit.toString() === id);
                setProduit(produitTrouve);
                setChargement(false);
            })
            .catch(err => {
                setErreur(err.message);
                setChargement(false);
            });
    }, [id]);

    useEffect(() => {
        if (!produit || !produit.images || produit.images.length <= 1) return;
        const intervalId = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % produit.images.length);
        }, 4000);
        return () => clearInterval(intervalId);
    }, [produit]);

    if (chargement) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', backgroundColor: 'var(--lemark-bg-offwhite)' }}>
                <h2 className="text-dark" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem' }}>CHARGEMENT DE LA FICHE TECHNIQUE...</h2>
            </div>
        );
    }

    if (erreur || !produit) {
        return (
            <div className="py-5" style={{ backgroundColor: 'var(--lemark-bg-offwhite)', minHeight: '60vh' }}>
                <div className="container">
                    <div className="bg-white border border-danger border-2 p-4 text-center shadow-sm rounded-0">
                        <span className="fw-bold d-block mb-2 text-danger" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>ÉQUIPEMENT INTROUVABLE</span>
                        <Link to="/catalogue" className="btn btn-outline-dark fw-bold rounded-0 px-4 py-2" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            RETOURNER AU CATALOGUE
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const imagesTriees = produit.images && produit.images.length > 0
        ? [...produit.images].sort((a, b) => (a.ordreAffichage || 1) - (b.ordreAffichage || 1))
        : [];

    const imagesList = imagesTriees.length > 0
        ? imagesTriees.map(img => `/images/produits/${img.nomFichier}`)
        : ['/images/produits/defaut_produit.png'];

    const imageAffichee = imagesList[imageIndex] || imagesList[0];

    const imageCouranteData = imagesTriees[imageIndex];
    let nomModeleAffiche = "-";
    if (imageCouranteData && produit.modeles) {
        const idRecherche = imageCouranteData.idModele || imageCouranteData.modeleId || imageCouranteData.idModeleLie;
        if (idRecherche) {
            const modeleAssocie = produit.modeles.find(m => m.idModele == idRecherche);
            if (modeleAssocie) nomModeleAffiche = modeleAssocie.nomModele;
        }
    }

    const texteDescription = produit.descriptionLongue || produit.descriptionCourte || "";
    const estTropLong = texteDescription.length > LIMITE_CARACTERES;
    const texteAffiche = descComplete || !estTropLong
        ? texteDescription
        : `${texteDescription.slice(0, LIMITE_CARACTERES)}...`;

    return (
        <div style={{
            backgroundColor: 'var(--lemark-bg-offwhite)',
            backgroundImage: 'linear-gradient(to right, rgba(24, 25, 27, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 25, 27, 0.035) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            minHeight: '100vh',
            paddingBottom: '5rem'
        }}>

            {/* Bandeau d'en-tête technique : Hauteur fixe et centrage vertical absolu, alignement à gauche */}
            <div style={{
                backgroundColor: 'var(--lemark-charcoal)',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '4px solid var(--lemark-red)',
                marginBottom: '3rem'
            }}>
                <div className="container text-start w-100">
                    <Link to="/catalogue" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', color: 'var(--lemark-yellow)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <span>&larr;</span>
                        <span>RETOUR AU CATALOGUE {produit.categorie ? `// ${produit.categorie.nomCategorie}` : ''}</span>
                    </Link>
                    <h1 className="text-white m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '4.5rem', lineHeight: '1' }}>
                        {produit.nomProduit}
                    </h1>
                </div>
            </div>

            <div className="container">
                <div className="row g-5">
                    {/* Colonne de Gauche : Photos */}
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                            <div className="text-white px-3 py-1 fw-bold" style={{ backgroundColor: 'var(--lemark-charcoal)', fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                                MODÈLE : {nomModeleAffiche}
                            </div>

                            <button type="button" className="btn bg-white border border-dark border-2 text-dark rounded-0 fw-bold d-inline-flex align-items-center gap-2 px-3 py-1" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem' }} onClick={() => setModalImage(imageAffichee)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/></svg>
                                <span>AGRANDIR</span>
                            </button>
                        </div>

                        <div className="bg-white border border-dark border-2 d-flex align-items-center justify-content-center p-4 position-relative" style={{ height: '400px', cursor: 'pointer', backgroundColor: '#E9ECEF' }} onClick={() => setModalImage(imageAffichee)}>
                            {produit.estNouveaute && (
                                <div className="position-absolute top-0 start-0 m-3 z-2">
                                    <span className="text-white px-2 py-1 fw-bold border border-white shadow-sm" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                                        NOUVEAUTÉ
                                    </span>
                                </div>
                            )}
                            <img src={imageAffichee} alt={produit.nomProduit} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' }} onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }} />
                        </div>

                        {imagesList.length > 1 && (
                            <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
                                {imagesList.map((imgSrc, idx) => (
                                    <div key={idx} className={`bg-white border border-2 p-1 flex-shrink-0 d-flex align-items-center justify-content-center ${idx === imageIndex ? 'border-danger' : 'border-dark'}`} style={{ width: '90px', height: '70px', cursor: 'pointer' }} onClick={() => setImageIndex(idx)}>
                                        <img src={imgSrc} alt={`Angle ${idx + 1}`} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne de Droite : Infos */}
                    <div className="col-lg-6">
                        {produit.modeles && produit.modeles.length > 0 && (
                            <div className="mb-4">
                                <div className="fw-bold mb-2 text-dark" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.5rem', letterSpacing: '1px' }}>
                                    MODÈLES DISPONIBLES ({produit.modeles.length}) :
                                </div>

                                {/* TABLEAU DE SPÉCIFICATIONS INDUSTRIEL (STATIQUE) */}
                                <div className="d-flex flex-column border border-dark border-2 bg-white" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>

                                    {/* En-tête du tableau */}
                                    <div className="d-flex justify-content-between px-3 py-2 text-white border-bottom border-dark border-2" style={{ backgroundColor: 'var(--lemark-charcoal)' }}>
                                        <span style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>MODÈLE</span>
                                        <span style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>DIMENSIONS</span>
                                    </div>

                                    {/* Lignes de données - Zéro effet de survol, 100% brut */}
                                    {produit.modeles.map((m, index) => (
                                        <div
                                            key={m.idModele || m.sku}
                                            className="d-flex justify-content-between align-items-center px-3 py-2"
                                            style={{
                                                borderBottom: index === produit.modeles.length - 1 ? 'none' : '2px solid #E9ECEF'
                                            }}
                                        >
                                            <span className="fw-bold" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.6rem', color: '#27292E', lineHeight: '1.2' }}>
                                                {m.nomModele}
                                            </span>
                                            <span className="fw-bold" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.05rem', color: '#495057' }}>
                                                {m.specifications || '-'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-dark border-2 p-4 mb-4 position-relative" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                            {/* Liseré rouge sur la boîte de description */}
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '3px', backgroundColor: 'var(--lemark-red)' }}></div>
                            <p className="m-0 mt-1 text-dark" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.05rem', lineHeight: '1.6' }}>
                                {texteAffiche}
                            </p>
                            {estTropLong && (
                                <button type="button" onClick={() => setDescComplete(!descComplete)} className="bg-transparent border-0 p-0 mt-3 text-danger fw-bold" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {descComplete ? '[ - RÉDUIRE LA DESCRIPTION ]' : '[ + LIRE LA DESCRIPTION COMPLÈTE ]'}
                                </button>
                            )}
                        </div>

                        {produit.options && produit.options.length > 0 && (
                            <div className="mb-4">
                                <button type="button" onClick={() => setAfficherOptions(!afficherOptions)} className="w-100 bg-white border border-dark border-2 p-3 d-flex justify-content-between align-items-center text-dark" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                                    <span className="fw-bold" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.5rem', letterSpacing: '1px' }}>
                                        OPTIONS & ÉQUIPEMENTS COMPATIBLES ({produit.options.length})
                                    </span>
                                    <span className="fw-bold text-danger" style={{ fontSize: '1.5rem' }}>{afficherOptions ? '−' : '+'}</span>
                                </button>

                                {afficherOptions && (
                                    <div className="mt-3 row g-3">
                                        {produit.options.map(option => {
                                            const optionImg = option.nomFichierImage ? `/images/options/${option.nomFichierImage}` : '/images/produits/defaut_produit.png';
                                            return (
                                                <div key={option.idOption} className="col-12 col-sm-6">
                                                    <div className="bg-white border border-dark border-2 h-100 d-flex flex-column" style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}>
                                                        <div className="position-relative border-bottom border-dark border-2 d-flex align-items-center justify-content-center p-2 cursor-pointer" style={{ height: '145px', backgroundColor: '#E9ECEF' }} onClick={() => setModalImage(optionImg)}>
                                                            <button type="button" className="btn bg-white border border-dark border-1 rounded-0 position-absolute top-0 end-0 m-2 p-1 d-flex align-items-center gap-1 z-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); setModalImage(optionImg); }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/></svg>
                                                            </button>
                                                            <img src={optionImg} alt={option.nomOption} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }} />
                                                        </div>
                                                        <div className="p-3 flex-grow-1">
                                                            <span className="d-block fw-bold text-dark mb-1" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.3rem', letterSpacing: '0.5px' }}>{option.nomOption}</span>
                                                            <p className="m-0 text-secondary" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', lineHeight: '1.4' }}>{option.descriptionOption}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-4" style={{ backgroundColor: 'var(--lemark-charcoal)', borderLeft: '6px solid var(--lemark-red)', boxShadow: '6px 6px 0px rgba(0,0,0,0.2)' }}>
                            <div className="text-white mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.8rem', letterSpacing: '1px', lineHeight: '1.1' }}>
                                VENIR VOIR L'ÉQUIPEMENT OU COMMANDER
                            </div>
                            <p className="text-white-50 mb-4" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Vous désirez vérifier la compatibilité avec votre véhicule, valider des dimensions ou inspecter nos équipements directement à l'atelier ? Prenez rendez-vous avec nous par téléphone.
                            </p>
                            <a href="tel:8193884921" className="btn d-flex align-items-center justify-content-center gap-2 w-100 rounded-0 border-0 text-white" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '1.6rem', padding: '0.5rem 1rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/></svg>
                                <span>(819) 388-4921</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Lightbox / Visionneuse */}
            {modalImage && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(20, 21, 24, 0.95)', zIndex: 2000 }} onClick={() => setModalImage(null)}>
                    <div className="position-relative bg-white border border-dark border-3 p-3 d-flex flex-column align-items-center" style={{ maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="btn btn-danger rounded-0 fw-bold position-absolute" style={{ top: '-15px', right: '-15px', fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} onClick={() => setModalImage(null)}>
                            FERMER [X]
                        </button>
                        <img src={modalImage} alt="Aperçu grand format" className="img-fluid" style={{ maxHeight: '75vh', objectFit: 'contain' }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProduitDetail;