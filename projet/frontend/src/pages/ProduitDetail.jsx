import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProduitDetail() {
    const { id } = useParams();
    const [produit, setProduit] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [modalImage, setModalImage] = useState(null);
    const [modalEnFermeture, setModalEnFermeture] = useState(false);
    const [descComplete, setDescComplete] = useState(false);

    // États pour le déroulement et la fermeture animée de l'accordéon d'options
    const [afficherOptions, setAfficherOptions] = useState(false);
    const [optionsEnFermeture, setOptionsEnFermeture] = useState(false);

    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);

    const LIMITE_CARACTERES = 175;

    useEffect(() => {
        fetch('/api/all_produits')
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

    const fermerModal = () => {
        setModalEnFermeture(true);
        setTimeout(() => {
            setModalImage(null);
            setModalEnFermeture(false);
        }, 180);
    };

    const ouvrirModal = (imgSrc) => {
        setModalEnFermeture(false);
        setModalImage(imgSrc);
    };

    const toggleOptions = () => {
        if (afficherOptions) {
            setOptionsEnFermeture(true);
            setTimeout(() => {
                setAfficherOptions(false);
                setOptionsEnFermeture(false);
            }, 280);
        } else {
            setAfficherOptions(true);
        }
    };

    if (chargement) {
        return (
            <div className="bg-lemark-grid d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <h2 className="text-dark" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem' }}>CHARGEMENT DE LA FICHE TECHNIQUE...</h2>
            </div>
        );
    }

    if (erreur || !produit) {
        return (
            <div className="bg-lemark-grid py-5" style={{ minHeight: '60vh' }}>
                <div className="container">
                    <div className="bg-white border border-danger border-2 p-4 text-center shadow-sm">
                        <span className="fw-bold d-block mb-2 text-danger" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>ÉQUIPEMENT INTROUVABLE</span>
                        <Link to="/catalogue" className="btn-lemark btn-lemark-dark px-4 py-2 fs-5">
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
        <div className="bg-lemark-grid" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
            {/* Styles d'animations : transition de droite à gauche et déroulement/fermeture fluide de l'accordéon */}
            <style>{`
                @keyframes imageSlideRightToLeft {
                    from { opacity: 0.2; transform: translateX(45px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes modalZoomOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.85); }
                }
                @keyframes accordionSlideDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes accordionSlideUp {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-16px); }
                }
                .img-carousel-transition {
                    animation: imageSlideRightToLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .modal-lemark-out {
                    animation: modalZoomOut 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
                }
                .accordion-slide-down {
                    animation: accordionSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .accordion-slide-up {
                    animation: accordionSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* En-tête technique unifié sur fond acier brossé */}
            <div
                className="bg-lemark-steel"
                style={{
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '4px solid var(--lemark-red)',
                    marginBottom: '3.5rem'
                }}
            >
                <div className="container text-start w-100">
                    <Link to="/catalogue" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', color: 'var(--lemark-yellow)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <span>&larr;</span>
                        <span>RETOUR AU CATALOGUE {produit.categorie ? `// ${produit.categorie.nomCategorie}` : ''}</span>
                    </Link>
                    <h1 className="text-white m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '4.5rem', lineHeight: '1', letterSpacing: '1px' }}>
                        {produit.nomProduit}
                    </h1>
                </div>
            </div>

            <div className="container">
                <div className="row g-5">
                    {/* Colonne de Gauche : Galerie Photo & Carrousel */}
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                            <div className="text-white px-3 py-1 fw-bold" style={{ backgroundColor: 'var(--lemark-charcoal)', fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                                MODÈLE : {nomModeleAffiche}
                            </div>

                            <button type="button" className="btn-lemark btn-lemark-outline px-3 py-1 fs-5 d-inline-flex align-items-center gap-2" onClick={() => ouvrirModal(imageAffichee)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/></svg>
                                <span>AGRANDIR</span>
                            </button>
                        </div>

                        {/* Cadre Média avec transition glissante de droite à gauche */}
                        <div
                            className="bg-white border border-dark border-2 d-flex align-items-center justify-content-center p-4 position-relative overflow-hidden cursor-pointer"
                            style={{ height: '400px', backgroundColor: '#E9ECEF' }}
                            onClick={() => ouvrirModal(imageAffichee)}
                        >
                            {produit.estNouveaute && (
                                <div className="position-absolute top-0 start-0 m-3 z-2">
                                    <span className="text-white px-2 py-1 fw-bold border border-white shadow-sm" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                                        NOUVEAUTÉ
                                    </span>
                                </div>
                            )}

                            <img
                                key={imageIndex}
                                src={imageAffichee}
                                alt={produit.nomProduit}
                                className="img-fluid img-carousel-transition"
                                style={{ maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' }}
                                onError={(e) => { e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                            />
                        </div>

                        {/* Miniatures carrousel */}
                        {imagesList.length > 1 && (
                            <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
                                {imagesList.map((imgSrc, idx) => (
                                    <div
                                        key={idx}
                                        className={`bg-white border border-2 p-1 flex-shrink-0 d-flex align-items-center justify-content-center cursor-pointer ${idx === imageIndex ? 'border-danger' : 'border-dark'}`}
                                        style={{ width: '90px', height: '70px' }}
                                        onClick={() => setImageIndex(idx)}
                                    >
                                        <img src={imgSrc} alt={`Angle ${idx + 1}`} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne de Droite : Spécifications et Options */}
                    <div className="col-lg-6">
                        {produit.modeles && produit.modeles.length > 0 && (
                            <div className="mb-4">
                                <div className="fw-bold mb-2 text-dark" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.5rem', letterSpacing: '1px' }}>
                                    MODÈLES DISPONIBLES ({produit.modeles.length}) :
                                </div>

                                {/* TABLEAU DE SPÉCIFICATIONS INDUSTRIEL STATIQUE */}
                                <div className="d-flex flex-column border border-dark border-2 bg-white" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                                    <div className="d-flex justify-content-between px-3 py-2 text-white border-bottom border-dark border-2" style={{ backgroundColor: 'var(--lemark-charcoal)' }}>
                                        <span style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>MODÈLE</span>
                                        <span style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>DIMENSIONS</span>
                                    </div>

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

                        {/* Boîte de Description */}
                        <div className="bg-white border border-dark border-2 p-4 mb-4 position-relative" style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                            <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: 'var(--lemark-red)' }}></div>
                            <p className="m-0 mt-1 text-dark" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.05rem', lineHeight: '1.6' }}>
                                {texteAffiche}
                            </p>
                            {estTropLong && (
                                <button type="button" onClick={() => setDescComplete(!descComplete)} className="bg-transparent border-0 p-0 mt-3 text-danger fw-bold cursor-pointer" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {descComplete ? '[ - RÉDUIRE LA DESCRIPTION ]' : '[ + LIRE LA DESCRIPTION COMPLÈTE ]'}
                                </button>
                            )}
                        </div>

                        {/* Accordéon d'Options avec libellé épuré et double animation (ouverture/fermeture) */}
                        {produit.options && produit.options.length > 0 && (
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={toggleOptions}
                                    className="w-100 bg-white border border-dark border-2 p-3 d-flex justify-content-between align-items-center text-dark cursor-pointer"
                                    style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
                                >
                                    <span className="fw-bold" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.5rem', letterSpacing: '1px' }}>
                                        OPTIONS COMPATIBLES ({produit.options.length})
                                    </span>
                                    <span className="fw-bold text-danger" style={{ fontSize: '1.5rem' }}>{afficherOptions && !optionsEnFermeture ? '−' : '+'}</span>
                                </button>

                                {(afficherOptions || optionsEnFermeture) && (
                                    <div className={`mt-3 row g-3 ${optionsEnFermeture ? 'accordion-slide-up' : 'accordion-slide-down'}`}>
                                        {produit.options.map(option => {
                                            const optionImg = option.nomFichierImage ? `/images/options/${option.nomFichierImage}` : '/images/produits/defaut_produit.png';
                                            return (
                                                <div key={option.idOption} className="col-12 col-sm-6">
                                                    <div className="bg-white border border-dark border-2 h-100 d-flex flex-column" style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}>
                                                        <div className="position-relative border-bottom border-dark border-2 d-flex align-items-center justify-content-center p-2 cursor-pointer" style={{ height: '145px', backgroundColor: '#E9ECEF' }} onClick={() => ouvrirModal(optionImg)}>
                                                            <button type="button" className="btn-lemark btn-lemark-outline position-absolute top-0 end-0 m-2 p-1 z-2" style={{ fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); ouvrirModal(optionImg); }}>
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

                        {/* Bloc d'Appel Direct / Commande (Numéro officiel 818-4921) */}
                        <div className="p-4" style={{ backgroundColor: 'var(--lemark-charcoal)', borderLeft: '6px solid var(--lemark-red)', boxShadow: '6px 6px 0px rgba(0,0,0,0.2)' }}>
                            <div className="text-white mb-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.8rem', letterSpacing: '1px', lineHeight: '1.1' }}>
                                VENIR VOIR L'ÉQUIPEMENT OU COMMANDER
                            </div>
                            <p className="text-white-50 mb-4" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Vous désirez vérifier la compatibilité avec votre véhicule, valider des dimensions ou inspecter nos équipements directement à l'atelier ? Prenez rendez-vous avec nous par téléphone.
                            </p>
                            <a href="tel:8198184921" className="btn-lemark btn-lemark-red d-flex align-items-center justify-content-center gap-2 w-100 fs-4 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/></svg>
                                <span>(819) 818-4921</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Lightbox / Visionneuse Animée */}
            {modalImage && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    style={{ backgroundColor: 'rgba(10, 10, 12, 0.92)', zIndex: 2000 }}
                    onClick={fermerModal}
                >
                    <div
                        className={`modal-lemark-content ${modalEnFermeture ? 'modal-lemark-out' : ''} position-relative bg-white border border-dark border-3 p-3 d-flex flex-column align-items-center`}
                        style={{ maxWidth: '85vw', maxHeight: '85vh', boxShadow: '12px 12px 0px rgba(0,0,0,0.5)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="btn-lemark btn-lemark-red position-absolute"
                            style={{ top: '-18px', right: '-18px', fontSize: '1.2rem', padding: '0.25rem 0.75rem' }}
                            onClick={fermerModal}
                        >
                            FERMER [X]
                        </button>
                        <img src={modalImage} alt="Aperçu grand format" className="img-fluid" style={{ maxHeight: '70vh', objectFit: 'contain' }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProduitDetail;