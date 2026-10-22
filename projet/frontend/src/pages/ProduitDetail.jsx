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

    // Logique du carrousel automatique
    useEffect(() => {
        if (!produit || !produit.images || produit.images.length <= 1) return;

        const intervalId = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % produit.images.length);
        }, 4000);

        return () => clearInterval(intervalId);
    }, [produit]);

    if (chargement) {
        return (
            <div className="detail-wrapper d-flex align-items-center justify-content-center py-5">
                <div className="text-center">
                    <h2 className="fw-bolder text-dark">Chargement de la fiche technique...</h2>
                </div>
            </div>
        );
    }

    if (erreur || !produit) {
        return (
            <div className="detail-wrapper py-5">
                <div className="container">
                    <div className="alert alert-danger border-2 p-4 text-center">
                        <span className="fw-bold d-block mb-2 fs-5">Équipement introuvable</span>
                        <Link to="/catalogue" className="btn btn-outline-danger fw-bold">
                            Retourner au catalogue
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

    // ==============================================================
    // DIAGNOSTIC ET ASSOCIATION DU MODÈLE
    // ==============================================================
    const imageCouranteData = imagesTriees[imageIndex];
    let nomModeleAffiche = "-"; // Tiret par défaut imposé

    console.log("--- DIAGNOSTIC IMAGE ---");
    console.log("1. Données brutes de l'image courante :", imageCouranteData);
    console.log("2. Liste des modèles du produit :", produit.modeles);

    if (imageCouranteData && produit.modeles) {
        // On capture l'ID peu importe son nom de variable JSON
        const idRecherche = imageCouranteData.idModele || imageCouranteData.modeleId || imageCouranteData.idModeleLie;

        if (idRecherche) {
            console.log("3. Recherche d'association pour l'ID :", idRecherche);
            // == (permissif) au lieu de === (strict) pour ignorer les conflits Chiffre/Texte
            const modeleAssocie = produit.modeles.find(m => m.idModele == idRecherche);

            if (modeleAssocie) {
                nomModeleAffiche = modeleAssocie.nomModele;
                console.log("4. Succès : Associé au modèle :", nomModeleAffiche);
            } else {
                console.warn("4. Échec : Aucun modèle trouvé correspondant à l'ID :", idRecherche);
            }
        } else {
            console.log("3. Aucun ID de modèle rattaché à cette image.");
        }
    }


    const texteDescription = produit.descriptionLongue || produit.descriptionCourte || "";
    const estTropLong = texteDescription.length > LIMITE_CARACTERES;
    const texteAffiche = descComplete || !estTropLong
        ? texteDescription
        : `${texteDescription.slice(0, LIMITE_CARACTERES)}...`;

    return (
        <div className="detail-wrapper">

            <div className="product-header-bar">
                <div className="container">
                    <Link to="/catalogue" className="product-breadcrumb-link">
                        <span>&larr;</span>
                        <span>Retour au catalogue {produit.categorie ? `// ${produit.categorie.nomCategorie}` : ''}</span>
                    </Link>
                    <h1 className="product-header-title">
                        {produit.nomProduit}
                    </h1>
                </div>
            </div>

            <div className="container">
                <div className="row g-5">

                    <div className="col-lg-6">

                        <div className="product-image-toolbar">
                            {/* La pastille est maintenant rendue inconditionnellement */}
                            <div className="badge-model-tag">
                                Modèle : {nomModeleAffiche}
                            </div>

                            <button
                                type="button"
                                className="btn-zoom-trigger"
                                onClick={() => setModalImage(imageAffichee)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                                <span>Agrandir</span>
                            </button>
                        </div>

                        <div
                            className="product-main-display"
                            onClick={() => setModalImage(imageAffichee)}
                        >
                            <img
                                src={imageAffichee}
                                alt={produit.nomProduit}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/images/produits/defaut_produit.png';
                                }}
                            />
                        </div>

                        {imagesList.length > 1 && (
                            <div className="product-thumbnail-strip">
                                {imagesList.map((imgSrc, idx) => (
                                    <div
                                        key={idx}
                                        className={`product-thumbnail-item ${idx === imageIndex ? 'active' : ''}`}
                                        onClick={() => setImageIndex(idx)}
                                    >
                                        <img src={imgSrc} alt={`Angle ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-lg-6">

                        {produit.modeles && produit.modeles.length > 0 && (
                            <div className="mb-4">
                                <div className="dimension-selector-label">
                                    Dimensions disponibles ({produit.modeles.length}) :
                                </div>

                                <div className="dimension-selector-grid">
                                    {produit.modeles.map((m) => {
                                        return (
                                            <div
                                                key={m.idModele || m.sku}
                                                className="btn-dimension-choice"
                                                style={{ cursor: 'default' }}
                                            >
                                                <span className="dimension-spec">
                                                    {m.specifications || m.nomModele}
                                                </span>
                                                <span className="dimension-model-name">
                                                    Modèle {m.nomModele}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="product-desc-box mb-4">
                            <p className="product-desc-text">
                                {texteAffiche}
                            </p>

                            {estTropLong && (
                                <button
                                    type="button"
                                    onClick={() => setDescComplete(!descComplete)}
                                    className="btn-link-expand"
                                >
                                    {descComplete ? '[ - Réduire la description ]' : '[ + Lire la description complète ]'}
                                </button>
                            )}
                        </div>

                        {produit.options && produit.options.length > 0 && (
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={() => setAfficherOptions(!afficherOptions)}
                                    className="btn-options-toggle"
                                >
                                    <span>Options & équipements compatibles ({produit.options.length})</span>
                                    <span className="fw-bold" style={{ color: 'var(--lemark-red)' }}>
                                        {afficherOptions ? '−' : '+'}
                                    </span>
                                </button>

                                {afficherOptions && (
                                    <div className="mt-3">
                                        <div className="row g-3">
                                            {produit.options.map(option => {
                                                const optionImg = option.nomFichierImage
                                                    ? `/images/options/${option.nomFichierImage}`
                                                    : '/images/produits/defaut_produit.png';

                                                return (
                                                    <div key={option.idOption} className="col-12 col-sm-6">
                                                        <div className="option-card-industrial">

                                                            <div
                                                                className="option-img-box"
                                                                onClick={() => setModalImage(optionImg)}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="btn-zoom-trigger"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setModalImage(optionImg);
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                                                                    </svg>
                                                                    <span>Agrandir</span>
                                                                </button>

                                                                <img
                                                                    src={optionImg}
                                                                    alt={option.nomOption}
                                                                    onError={(e) => {
                                                                        e.currentTarget.onerror = null;
                                                                        e.currentTarget.src = '/images/produits/defaut_produit.png';
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="option-body">
                                                                <span className="option-title">{option.nomOption}</span>
                                                                <p className="option-desc">{option.descriptionOption}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="cta-phone-card">
                            <div className="cta-phone-title">
                                Venir voir l'équipement ou commander
                            </div>
                            <p className="cta-phone-text">
                                Vous désirez vérifier la compatibilité avec votre véhicule, valider des dimensions ou inspecter nos machines directement à l'atelier ? Prenez rendez-vous avec nous par téléphone.
                            </p>
                            <a href="tel:18005550199" className="btn-phone-massive">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                                </svg>
                                <span>1-800-555-0199</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {modalImage && (
                <div className="lightbox-backdrop" onClick={() => setModalImage(null)}>
                    <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="lightbox-close"
                            onClick={() => setModalImage(null)}
                        >
                            Fermer [X]
                        </button>
                        <img
                            src={modalImage}
                            alt="Aperçu grand format"
                            className="lightbox-img"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProduitDetail;