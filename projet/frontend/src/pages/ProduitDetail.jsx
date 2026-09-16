import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProduitDetail() {
    const { id } = useParams();
    const [produit, setProduit] = useState(null);
    const [modeleSelectionne, setModeleSelectionne] = useState("");
    const [chargement, setChargement] = useState(true);

    // État pour gérer l'ouverture/fermeture du tiroir d'options
    const [afficherOptions, setAfficherOptions] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/all_produits')
            .then(res => res.json())
            .then(data => {
                const produitTrouve = data.find(p => p.idProduit.toString() === id);
                setProduit(produitTrouve);
                if (produitTrouve && produitTrouve.modeles && produitTrouve.modeles.length > 0) {
                    setModeleSelectionne(produitTrouve.modeles[0].sku);
                }
                setChargement(false);
            });
    }, [id]);

    if (chargement) return <div className="container py-5 text-center fs-4 fw-bold">Chargement...</div>;
    if (!produit) return <div className="container py-5 text-center fs-4">Produit introuvable.</div>;

    const imageUrl = produit.images && produit.images.length > 0
        ? `/images/produits/${produit.images[0].nomFichier}`
        : '/images/produits/defaut_produit.png';

    const detailsModele = produit.modeles?.find(m => m.sku === modeleSelectionne);

    return (
        <div className="container py-4">
            <Link to="/catalogue" className="btn btn-outline-dark fw-bold mb-4 px-4 py-2">
                &larr; Retour au catalogue
            </Link>

            <div className="row justify-content-between">
                {/* Image */}
                <div className="col-lg-6 mb-5 mb-lg-0">
                    <div className="border rounded bg-light p-4 text-center shadow-sm h-100 d-flex align-items-center justify-content-center position-relative" style={{ minHeight: '400px' }}>

                        {/* Pastille dynamique du modèle sélectionné */}
                        {detailsModele && (
                            <span className="badge bg-secondary position-absolute top-0 end-0 m-3 p-2 fs-5 shadow z-1 border border-light">
                                Modèle illustré : {detailsModele.sku}
                            </span>
                        )}

                        <img
                            src={imageUrl}
                            alt={produit.nomProduit}
                            className="img-fluid"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                        />
                    </div>
                </div>

                {/* Informations */}
                <div className="col-lg-5">
                    {produit.categorie && (
                        <span className="text-lemark-red fw-bold text-uppercase mb-2 d-block fs-5">
                            {produit.categorie.nomCategorie}
                        </span>
                    )}
                    <h1 className="fw-bolder display-5 mb-3">{produit.nomProduit}</h1>
                    <p className="fs-5 text-secondary mb-4">{produit.descriptionLongue || produit.descriptionCourte}</p>

                    <hr className="my-4" />

                    {/* Modèles */}
                    {produit.modeles && produit.modeles.length > 0 && (
                        <div className="mb-4 bg-light p-4 rounded border">
                            <label htmlFor="selectModele" className="form-label fw-bold fs-5 mb-3">
                                Spécifications :
                            </label>
                            <select
                                id="selectModele"
                                className="form-select form-select-lg mb-3 border-dark fw-bold"
                                value={modeleSelectionne}
                                onChange={(e) => setModeleSelectionne(e.target.value)}
                            >
                                {produit.modeles.map(m => (
                                    <option key={m.idModele} value={m.sku}>
                                        Modèle {m.sku} - {m.nomModele}
                                    </option>
                                ))}
                            </select>

                            {detailsModele && detailsModele.specifications && (
                                <div className="alert alert-secondary mt-3 mb-0 text-dark">
                                    {detailsModele.specifications}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tiroir d'options (Accordéon) */}
                    {produit.options && produit.options.length > 0 && (
                        <div className="mb-4 pt-2">
                            <button
                                onClick={() => setAfficherOptions(!afficherOptions)}
                                className="btn btn-outline-dark w-100 py-3 fw-bold d-flex justify-content-between align-items-center bg-white shadow-sm border-2"
                            >
                                <span className="fs-5">Voir les options compatibles</span>
                                <span className="fs-3 fw-bolder text-lemark-red" style={{lineHeight: '0.5'}}>
                                    {afficherOptions ? '-' : '+'}
                                </span>
                            </button>

                            {afficherOptions && (
                                <div className="mt-2 bg-light p-4 rounded border border-secondary shadow-sm">
                                    <p className="fw-bold fs-6 mb-3 text-dark">
                                        Renseignez-vous sur ces ajouts lors de votre appel :
                                    </p>
                                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                                        {produit.options.map(option => {
                                            // Détermine la source de l'image de l'option
                                            const optionImageUrl = option.nomFichierImage
                                                ? `/images/options/${option.nomFichierImage}`
                                                : '/images/produits/defaut_produit.png';

                                            return (
                                                <li key={option.idOption} className="pb-3 border-bottom border-dark last-child-no-border d-flex align-items-center gap-3">

                                                    {/* La Miniature (Thumbnail) */}
                                                    <div className="flex-shrink-0 bg-white border rounded p-1 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                                        <img
                                                            src={optionImageUrl}
                                                            alt={option.nomOption}
                                                            className="img-fluid object-fit-contain"
                                                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/produits/defaut_produit.png'; }}
                                                        />
                                                    </div>

                                                    {/* Le Texte */}
                                                    <div>
                                                        <strong className="d-block fs-5 text-lemark-red mb-1">
                                                            {option.nomOption}
                                                        </strong>
                                                        <span className="text-secondary fs-6">
                                                            {option.descriptionOption}
                                                        </span>
                                                    </div>

                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bouton d'Appel (Call to Action) */}
                    <div className="mt-4 pt-3 border-top">
                        <p className="fw-bold fs-5 mb-3">Ce produit vous intéresse ? Vérifiez sa compatibilité avec votre VTT.</p>
                        <a href="tel:18005550199" className="btn btn-lemark w-100 py-3 fs-4 d-flex align-items-center justify-content-center gap-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                            </svg>
                            Appeler le 1-800-555-0199
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProduitDetail;