import { useState, useEffect } from 'react';

// ==========================================
// COMPOSANTS VISUELS GÉNÉRIQUES (DÉPLACÉS EN DEHORS DE LA FONCTION)
// ==========================================
const ToastAlert = ({ toast, setToast }) => toast && (
    <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 9999 }}>
        <div className={`bg-white border-start border-5 ${toast.type === 'error' ? 'border-danger text-danger' : 'border-success text-success'} shadow-lg p-3 d-flex justify-content-between align-items-center`} style={{ minWidth: '300px', border: '2px solid #18191B', borderRadius: '0' }}>
            <span className="fw-bold" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem' }}>{toast.message}</span>
            <button type="button" className="btn p-0 text-dark fw-bold" onClick={() => setToast(null)} style={{ fontSize: '1.5rem', lineHeight: '1' }}>&times;</button>
        </div>
    </div>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-3.5zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
    </svg>
);

const BoutonSauvegardeMassif = ({ texte, formId }) => (
    <button type="submit" form={formId} className="w-100 text-white border-0 py-3 mt-4" style={{ backgroundColor: 'var(--lemark-red)', fontFamily: "'Teko', sans-serif", fontSize: '2.2rem', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>
        {texte}
    </button>
);

const FormInput = ({ label, type = "text", value, onChange, placeholder, required }) => (
    <div className="mb-3">
        <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', letterSpacing: '0.5px', height: '22px' }}>{label}</label>
        <input type={type} className="form-control rounded-0 border-dark border-2 p-2 fw-bold bg-white" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem' }} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
);

const TitreSection = ({ titre, boutonTexte, boutonAction }) => (
    <div className="d-flex justify-content-between align-items-end border-bottom border-dark border-3 pb-3 mb-4">
        <h1 className="text-dark m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '3rem', lineHeight: '1' }}>{titre}</h1>
        {boutonTexte && <button type="button" className="bg-dark text-white border-0 px-4 py-2" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.5rem', letterSpacing: '1px' }} onClick={boutonAction}>{boutonTexte}</button>}
    </div>
);

// ==========================================
// APPLICATION PRINCIPALE
// ==========================================
function Admin() {
    // --- États de sécurité ---
    const [courriel, setCourriel] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [jeton, setJeton] = useState(localStorage.getItem('lemark_jwt') || null);
    const [courrielActif, setCourrielActif] = useState(localStorage.getItem('lemark_courriel') || '');

    // --- Moteur de Toasts (Notifications) ---
    const [toast, setToast] = useState(null);
    const afficherToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // --- Navigation ---
    const [ongletActif, setOngletActif] = useState('equipements');
    const [vueEquipement, setVueEquipement] = useState('liste');
    const [vueOption, setVueOption] = useState('liste');
    const [vueCategorie, setVueCategorie] = useState('liste');
    const [vueCompte, setVueCompte] = useState('liste');

    // --- Données globales ---
    const [produits, setProduits] = useState([]);
    const [optionsGlobales, setOptionsGlobales] = useState([]);
    const [categories, setCategories] = useState([]);
    const [comptes, setComptes] = useState([]);
    const [parametres, setParametres] = useState({
        banniereActive: false, banniereTexte: ''
    });

    // --- États Formulaires ---
    const [idOriginal, setIdOriginal] = useState(null);
    const formulaireVide = { idProduit: '', nomProduit: '', descriptionCourte: '', descriptionLongue: '', estNouveaute: false, categorie: { idCategorie: '' } };
    const [formData, setFormData] = useState(formulaireVide);

    const formModeleVide = { idModele: '', sku: '', nomModele: '', specifications: '', idProduit: null };
    const [formDataModele, setFormDataModele] = useState(formModeleVide);
    const [idOriginalModele, setIdOriginalModele] = useState(null);

    const formImageVide = { idImage: '', nomFichier: '', ordreAffichage: 1, idModele: '' };
    const [formDataImage, setFormDataImage] = useState(formImageVide);
    const [idOriginalImage, setIdOriginalImage] = useState(null);
    const [fichierImage, setFichierImage] = useState(null);

    const formOptionVide = { idOption: '', sku: '', nomOption: '', descriptionOption: '' };
    const [formDataOption, setFormDataOption] = useState(formOptionVide);
    const [idOriginalOption, setIdOriginalOption] = useState(null);

    const formCategorieVide = { idCategorie: '', nomCategorie: '' };
    const [formDataCategorie, setFormDataCategorie] = useState(formCategorieVide);
    const [idOriginalCategorie, setIdOriginalCategorie] = useState(null);

    const formCompteVide = { courriel: '', motDePasse: '' };
    const [formDataCompte, setFormDataCompte] = useState(formCompteVide);
    const [idOriginalCompte, setIdOriginalCompte] = useState(null);

    // ==========================================
    // CHARGEMENT DES DONNÉES
    // ==========================================
    const chargerProduits = () => fetch('http://localhost:8080/api/all_produits').then(res => res.json()).then(data => setProduits(Array.isArray(data) ? data.sort((a, b) => a.idProduit - b.idProduit) : [])).catch(console.error);
    const chargerOptions = () => fetch('http://localhost:8080/api/admin/options', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(setOptionsGlobales).catch(console.error);
    const chargerCategories = () => fetch('http://localhost:8080/api/admin/categories', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(setCategories).catch(console.error);
    const chargerParametres = () => fetch('http://localhost:8080/api/admin/parametres', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(data => { if(data) setParametres(data); }).catch(console.error);
    const chargerComptes = () => fetch('http://localhost:8080/api/admin/comptes', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(data => setComptes(data)).catch(console.error);

    useEffect(() => {
        if (jeton) { chargerProduits(); chargerOptions(); chargerCategories(); chargerParametres(); chargerComptes(); }
    }, [jeton]);

    // ==========================================
    // AUTHENTIFICATION
    // ==========================================
    const handleLogin = async (e) => {
        e.preventDefault();
        setChargement(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courriel, motDePasse }),
            });
            if (!response.ok) throw new Error('Identifiants incorrects ou accès refusé.');
            const data = await response.json();
            localStorage.setItem('lemark_jwt', data.token);
            localStorage.setItem('lemark_courriel', courriel);
            setJeton(data.token); setCourrielActif(courriel);
            afficherToast("Connexion réussie", "success");
        } catch (err) {
            afficherToast(err.message, "error");
        } finally {
            setChargement(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('lemark_jwt'); localStorage.removeItem('lemark_courriel');
        setJeton(null); setCourriel(''); setMotDePasse(''); setCourrielActif('');
    };

    // ==========================================
    // ACTIONS ADMIN
    // ==========================================
    const ouvrirFormulaireCompte = () => { setIdOriginalCompte(null); setFormDataCompte(formCompteVide); setVueCompte('formulaire'); };
    const editerCompte = (compte) => { setIdOriginalCompte(compte.idAdmin); setFormDataCompte({ courriel: compte.courriel, motDePasse: '' }); setVueCompte('formulaire'); };
    const handleSauvegarderCompte = async (e) => {
        e.preventDefault();
        const estModif = idOriginalCompte !== null;
        try {
            const res = await fetch(estModif ? `http://localhost:8080/api/admin/comptes/${idOriginalCompte}` : `http://localhost:8080/api/admin/comptes`, {
                method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(formDataCompte),
            });
            if (!res.ok) throw new Error("Erreur de sauvegarde.");
            if (estModif && formDataCompte.courriel !== courrielActif && comptes.find(c => c.idAdmin === idOriginalCompte)?.courriel === courrielActif) {
                setCourrielActif(formDataCompte.courriel); localStorage.setItem('lemark_courriel', formDataCompte.courriel);
            }
            chargerComptes(); setVueCompte('liste'); afficherToast(estModif ? "Compte mis à jour" : "Nouvel accès généré", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };
    const handleSupprimerCompte = async (id, email) => {
        if (email === courrielActif) return afficherToast("Interdit : Tu ne peux pas supprimer ton propre compte.", "error");
        if (!window.confirm(`⚠️ Retirer l'accès pour "${email}" ?`)) return;
        try {
            await fetch(`http://localhost:8080/api/admin/comptes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
            chargerComptes(); afficherToast("Accès révoqué", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };

    const ouvrirFormulaireAjout = () => { setIdOriginal(null); setFormData({...formulaireVide, categorie: { idCategorie: categories.length > 0 ? categories[0].idCategorie : '' }}); setVueEquipement('formulaire'); };
    const ouvrirFormulaireModification = (produit) => {
        setIdOriginal(produit.idProduit);
        setFormData({
            idProduit: produit.idProduit, nomProduit: produit.nomProduit || '', descriptionCourte: produit.descriptionCourte || '',
            descriptionLongue: produit.descriptionLongue || '', estNouveaute: produit.estNouveaute || false,
            categorie: { idCategorie: produit.categorie ? produit.categorie.idCategorie : (categories[0]?.idCategorie || '') }
        });
        setFormDataModele(formModeleVide); setIdOriginalModele(null);
        setFormDataImage(formImageVide); setIdOriginalImage(null); setFichierImage(null);
        setVueEquipement('formulaire');
    };
    const handleSauvegarderProduit = async (e) => {
        e.preventDefault();
        const estModif = idOriginal !== null;
        try {
            const payload = { ...formData, idProduit: estModif ? parseInt(formData.idProduit) : null };
            const response = await fetch(estModif ? `http://localhost:8080/api/admin/produits/${idOriginal}` : `http://localhost:8080/api/admin/produits`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error("Erreur de sauvegarde de l'équipement.");
            chargerProduits();
            setVueEquipement('liste');
            afficherToast(estModif ? "Fiche mise à jour" : "Équipement créé.", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };
    const handleSupprimerProduit = async (id, nom) => {
        if (!window.confirm(`⚠️ Supprimer l'équipement "${nom}" ?`)) return;
        try {
            await fetch(`http://localhost:8080/api/admin/produits/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
            chargerProduits(); afficherToast("Équipement supprimé", "success");
        } catch (err) { afficherToast("Erreur lors de la suppression.", "error"); }
    };
    const toggleCompatibilite = async (idOption, lier) => {
        try {
            await fetch(`http://localhost:8080/api/admin/options/produit/${idOriginal}/${lier ? 'lier' : 'retirer'}/${idOption}`, { method: lier ? 'POST' : 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` }});
            chargerProduits(); afficherToast(lier ? "Option liée" : "Option retirée", "success");
        } catch (err) { afficherToast("Erreur lors de la modification.", "error"); }
    };

    const editerModele = (modele) => { setIdOriginalModele(modele.idModele); setFormDataModele({ idModele: modele.idModele, sku: modele.sku || '', nomModele: modele.nomModele || '', specifications: modele.specifications || '', idProduit: idOriginal }); };
    const annulerModele = () => { setIdOriginalModele(null); setFormDataModele(formModeleVide); };
    const handleSauvegarderModele = async (e) => {
        e.preventDefault();
        const estModif = idOriginalModele !== null;
        try {
            const payload = { ...formDataModele, idModele: estModif ? parseInt(formDataModele.idModele) : null, idProduit: idOriginal };
            const res = await fetch(estModif ? `http://localhost:8080/api/admin/modeles/${idOriginalModele}` : `http://localhost:8080/api/admin/modeles`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("Erreur de sauvegarde.");
            chargerProduits(); annulerModele(); afficherToast(estModif ? "Modèle mis à jour" : "Modèle ajouté", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };
    const handleSupprimerModele = async (idModele, nom) => {
        if (!window.confirm(`⚠️ Retirer le modèle "${nom}" ?`)) return;
        try {
            await fetch(`http://localhost:8080/api/admin/modeles/${idModele}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
            chargerProduits(); afficherToast("Modèle retiré", "success");
        } catch(err) { afficherToast("Erreur de suppression.", "error"); }
    };

    const editerImage = (img) => { setIdOriginalImage(img.idImage); setFormDataImage({ idImage: img.idImage, nomFichier: img.nomFichier || '', ordreAffichage: img.ordreAffichage || 1, idModele: img.idModele || '' }); setFichierImage(null); };
    const annulerImage = () => { setIdOriginalImage(null); setFormDataImage(formImageVide); setFichierImage(null); };
    const handleSauvegarderImage = async (e) => {
        e.preventDefault();
        const estModif = idOriginalImage !== null;
        if (!estModif && !fichierImage) return afficherToast("Veuillez sélectionner un fichier.", "error");

        const data = new FormData();
        if (estModif) data.append('idImage', parseInt(formDataImage.idImage));
        data.append('ordreAffichage', parseInt(formDataImage.ordreAffichage));
        data.append('idProduit', idOriginal);
        if (formDataImage.nomFichier) data.append('nomFichier', formDataImage.nomFichier);
        if (formDataImage.idModele && formDataImage.idModele !== "") data.append('idModele', parseInt(formDataImage.idModele));
        if (fichierImage) data.append('fichier', fichierImage);

        try {
            const res = await fetch(estModif ? `http://localhost:8080/api/admin/images/${idOriginalImage}` : `http://localhost:8080/api/admin/images`, { method: estModif ? 'PUT' : 'POST', headers: { 'Authorization': `Bearer ${jeton}` }, body: data });
            if (!res.ok) throw new Error("Erreur d'enregistrement de l'image.");
            chargerProduits(); annulerImage();
            afficherToast(estModif ? "Image mise à jour" : "Image ajoutée", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };
    const handleSupprimerImage = async (idImage, nomFichier) => {
        if (!window.confirm(`⚠️ Retirer l'image "${nomFichier}" ?`)) return;
        try {
            await fetch(`http://localhost:8080/api/admin/images/${idImage}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
            chargerProduits(); afficherToast("Image retirée", "success");
        } catch (err) { afficherToast("Erreur de suppression.", "error"); }
    };

    const ouvrirFormulaireOption = () => { setIdOriginalOption(null); setFormDataOption(formOptionVide); setVueOption('formulaire'); };
    const editerOption = (opt) => { setIdOriginalOption(opt.idOption); setFormDataOption({ idOption: opt.idOption, sku: opt.sku || '', nomOption: opt.nomOption || '', descriptionOption: opt.descriptionOption || '' }); setVueOption('formulaire'); };
    const handleSauvegarderOption = async (e) => {
        e.preventDefault();
        const estModif = idOriginalOption !== null;
        try {
            const payload = { ...formDataOption, idOption: estModif ? parseInt(formDataOption.idOption) : null };
            const res = await fetch(estModif ? `http://localhost:8080/api/admin/options/${idOriginalOption}` : `http://localhost:8080/api/admin/options`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("Erreur de sauvegarde.");
            chargerOptions(); setVueOption('liste'); afficherToast(estModif ? "Option mise à jour" : "Option créée", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };
    const handleSupprimerOption = async (id, nom) => {
        if (!window.confirm(`⚠️ Retirer définitivement l'option "${nom}" ?`)) return;
        try {
            await fetch(`http://localhost:8080/api/admin/options/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
            chargerOptions(); chargerProduits(); afficherToast("Option supprimée", "success");
        } catch (err) { afficherToast("Erreur de suppression.", "error"); }
    };

    const ouvrirFormulaireCategorie = () => { setIdOriginalCategorie(null); setFormDataCategorie(formCategorieVide); setVueCategorie('formulaire'); };
    const editerCategorie = (cat) => { setIdOriginalCategorie(cat.idCategorie); setFormDataCategorie({ idCategorie: cat.idCategorie, nomCategorie: cat.nomCategorie || '' }); setVueCategorie('formulaire'); };
    const handleSauvegarderCategorie = async (e) => {
        e.preventDefault();
        const estModif = idOriginalCategorie !== null;
        try {
            const payload = { ...formDataCategorie, idCategorie: estModif ? parseInt(formDataCategorie.idCategorie) : null };
            const res = await fetch(estModif ? `http://localhost:8080/api/admin/categories/${idOriginalCategorie}` : `http://localhost:8080/api/admin/categories`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("Erreur de sauvegarde.");
            chargerCategories(); chargerProduits(); setVueCategorie('liste'); afficherToast(estModif ? "Catégorie mise à jour" : "Catégorie créée", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };
    const handleSupprimerCategorie = async (id, nom) => {
        if (!window.confirm(`⚠️ Retirer la catégorie "${nom}" ?`)) return;
        try {
            const res = await fetch(`http://localhost:8080/api/admin/categories/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
            if (!res.ok) throw new Error(`Des équipements utilisent encore la catégorie "${nom}".`);
            chargerCategories(); afficherToast("Catégorie supprimée", "success");
        } catch (err) { afficherToast(err.message, "error"); }
    };

    const handleSauvegarderParametres = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:8080/api/admin/parametres', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(parametres) });
            afficherToast('Paramètres enregistrés !', 'success');
        } catch (err) { afficherToast("Erreur de sauvegarde", "error"); }
    };

    const produitActif = produits.find(p => p.idProduit === idOriginal);
    const modelesActuels = produitActif ? (produitActif.modeles || []) : [];
    const imagesActuelles = produitActif && produitActif.images ? [...produitActif.images].sort((a, b) => a.ordreAffichage - b.ordreAffichage) : [];
    const optionsActuellesIds = produitActif && produitActif.options ? produitActif.options.map(o => o.idOption) : [];

    // ==========================================
    // RENDU CONNECTÉ
    // ==========================================
    if (jeton) {
        return (
            <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--lemark-bg-offwhite)', backgroundImage: 'linear-gradient(to right, rgba(24, 25, 27, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 25, 27, 0.035) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <ToastAlert toast={toast} setToast={setToast} />

                {/* SIDEBAR */}
                <div style={{ width: '280px', backgroundColor: 'var(--lemark-charcoal)', borderRight: '4px solid var(--lemark-red)', display: 'flex', flexDirection: 'column' }}>
                    <div className="p-4 border-bottom border-secondary border-opacity-25">
                        <h2 className="text-white m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2.5rem', letterSpacing: '1px' }}>GESTION</h2>
                    </div>

                    <div className="d-flex flex-column p-3 gap-2 flex-grow-1">
                        {[
                            { id: 'equipements', label: 'ÉQUIPEMENTS' },
                            { id: 'categories', label: 'CATÉGORIES' },
                            { id: 'options', label: 'OPTIONS' },
                            { id: 'parametres', label: 'PARAMÈTRES SITE' },
                            { id: 'comptes', label: 'ACCÈS & SÉCURITÉ' }
                        ].map(tab => (
                            <button key={tab.id} className="text-start border-0 p-3 fw-bold" style={{ backgroundColor: ongletActif === tab.id ? 'var(--lemark-red)' : 'transparent', color: 'white', fontFamily: "'Barlow', sans-serif", fontSize: '1rem', letterSpacing: '1px' }} onClick={() => { setOngletActif(tab.id); if(tab.id === 'equipements') setVueEquipement('liste'); if(tab.id === 'categories') setVueCategorie('liste'); if(tab.id === 'options') setVueOption('liste'); if(tab.id === 'comptes') setVueCompte('liste'); }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-3 border-top border-secondary border-opacity-25">
                        <button onClick={handleLogout} className="w-100 bg-transparent border border-white border-2 text-white p-2 fw-bold" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>LOG OUT</button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-grow-1 p-5 overflow-auto" style={{ maxHeight: '100vh' }}>

                    {/* ONGLET ÉQUIPEMENTS */}
                    {ongletActif === 'equipements' && (
                        <>
                            {vueEquipement === 'liste' ? (
                                <div>
                                    <TitreSection titre="INVENTAIRE DES ÉQUIPEMENTS" boutonTexte="+ NOUVEL ÉQUIPEMENT" boutonAction={ouvrirFormulaireAjout} />
                                    <table className="table table-bordered border-dark bg-white shadow-sm">
                                        <thead style={{ backgroundColor: 'var(--lemark-charcoal)', color: 'white', border: '2px solid black', borderBottom: '4px solid black' }}>
                                        <tr style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                                            <th className="border-dark">ID</th><th className="border-dark">NOM DE L'ÉQUIPEMENT</th><th className="border-dark">CATÉGORIE</th><th className="text-end border-dark">ACTIONS</th>
                                        </tr>
                                        </thead>
                                        <tbody style={{ fontFamily: "'Barlow', sans-serif" }}>
                                        {produits.map(prod => (
                                            <tr key={prod.idProduit} className="align-middle">
                                                <td className="fw-bold text-secondary">#{prod.idProduit}</td><td className="fw-bold">{prod.nomProduit}</td><td>{prod.categorie ? prod.categorie.nomCategorie : '-'}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-dark rounded-0 fw-bold me-2 px-3" onClick={() => ouvrirFormulaireModification(prod)}>ÉDITER</button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger rounded-0 fw-bold px-2" onClick={() => handleSupprimerProduit(prod.idProduit, prod.nomProduit)} title="Retirer"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div>
                                    <TitreSection titre={idOriginal ? `FICHE : ${formData.nomProduit}` : 'CRÉER UN NOUVEL ÉQUIPEMENT'} boutonTexte="← RETOUR" boutonAction={() => setVueEquipement('liste')} />

                                    <form id="form-equipement" onSubmit={handleSauvegarderProduit} className="bg-white border border-dark border-2 p-4 shadow-sm mb-5">
                                        <div className="row">
                                            <div className="col-md-8"><FormInput label="Nom de l'équipement" value={formData.nomProduit} onChange={e => setFormData({...formData, nomProduit: e.target.value})} required /></div>
                                            <div className="col-md-4">
                                                <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', height: '22px' }}>Catégorie</label>
                                                <select className="form-select rounded-0 border-dark border-2 p-2 fw-bold" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem' }} value={formData.categorie.idCategorie} onChange={e => setFormData({...formData, categorie: { idCategorie: parseInt(e.target.value) }})} required>
                                                    {categories.map(cat => <option key={cat.idCategorie} value={cat.idCategorie}>{cat.nomCategorie}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-4 d-flex align-items-center gap-2 border border-dark p-3 bg-light" style={{ width: 'fit-content' }}>
                                            <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={formData.estNouveaute} onChange={e => setFormData({...formData, estNouveaute: e.target.checked})}/>
                                            <span className="fw-bold text-dark text-uppercase" style={{ fontFamily: "'Barlow', sans-serif" }}>Afficher l'étiquette rouge "NOUVEAUTÉ"</span>
                                        </div>
                                        <FormInput label="Description Courte" value={formData.descriptionCourte} onChange={e => setFormData({...formData, descriptionCourte: e.target.value})} />
                                        <div className="mb-3">
                                            <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', height: '22px' }}>Description Longue</label>
                                            <textarea className="form-control rounded-0 border-dark border-2 p-2 fw-bold bg-white" style={{ fontFamily: "'Barlow', sans-serif", minHeight: '100px' }} value={formData.descriptionLongue} onChange={e => setFormData({...formData, descriptionLongue: e.target.value})} />
                                        </div>
                                    </form>

                                    {idOriginal && (
                                        <div className="row g-4 mb-5">
                                            {/* Modèles */}
                                            <div className="col-lg-7">
                                                <div className="bg-white border border-dark border-2 p-4 h-100 shadow-sm">
                                                    <h3 className="text-dark border-bottom border-dark border-2 pb-2 mb-3" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>MODÈLES</h3>
                                                    {modelesActuels.length > 0 && (
                                                        <table className="table table-bordered border-dark table-sm mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                                            <thead style={{ backgroundColor: 'var(--lemark-charcoal)', color: 'white', border: '2px solid black', borderBottom: '4px solid black' }} className="text-uppercase">
                                                            <tr><th className="border-dark">ID</th><th className="border-dark">Code</th><th className="border-dark">Nom</th><th className="border-dark">Specs</th><th className="text-end border-dark">Actions</th></tr>
                                                            </thead>
                                                            <tbody>
                                                            {modelesActuels.map(mod => (
                                                                <tr key={mod.idModele}>
                                                                    <td className="fw-bold text-secondary">#{mod.idModele}</td><td>{mod.sku}</td><td className="fw-bold">{mod.nomModele}</td><td>{mod.specifications}</td>
                                                                    <td className="text-end">
                                                                        <button type="button" className="btn btn-sm btn-dark rounded-0 fw-bold px-2 py-0 me-1" onClick={() => editerModele(mod)}>ÉDITER</button>
                                                                        <button type="button" className="btn btn-sm btn-outline-danger rounded-0 fw-bold px-2 py-0" onClick={() => handleSupprimerModele(mod.idModele, mod.nomModele)} title="Retirer"><TrashIcon /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                    <div className="bg-light border border-dark p-3">
                                                        <h5 className="fw-bold mb-3 text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem' }}>{idOriginalModele ? 'MODIFIER LE MODÈLE' : '+ AJOUTER UN MODÈLE'}</h5>
                                                        <form onSubmit={handleSauvegarderModele} className="row g-2">
                                                            <div className="col-4"><FormInput label="Code (SKU)" value={formDataModele.sku} onChange={e => setFormDataModele({...formDataModele, sku: e.target.value})} /></div>
                                                            <div className="col-8"><FormInput label="Nom (Ex: SP36)" value={formDataModele.nomModele} onChange={e => setFormDataModele({...formDataModele, nomModele: e.target.value})} required /></div>
                                                            <div className="col-12"><FormInput label="Spécifications (Ex: 36 po x 48 po)" value={formDataModele.specifications} onChange={e => setFormDataModele({...formDataModele, specifications: e.target.value})} required /></div>
                                                            <div className="col-12 d-flex gap-2">
                                                                <button type="submit" className="btn btn-dark rounded-0 fw-bold px-4 py-2 w-100" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem' }}>{idOriginalModele ? 'METTRE À JOUR' : 'AJOUTER LE MODÈLE'}</button>
                                                                {idOriginalModele && <button type="button" className="btn btn-outline-dark rounded-0 fw-bold px-4 py-2" onClick={annulerModele} style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem' }}>ANNULER</button>}
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Options Compatibles */}
                                            <div className="col-lg-5">
                                                <div className="bg-white border border-dark border-2 p-4 h-100 shadow-sm">
                                                    <h3 className="text-dark border-bottom border-dark border-2 pb-2 mb-3" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>OPTIONS COMPATIBLES</h3>
                                                    <div className="d-flex flex-column gap-2" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                                        {optionsGlobales.map(opt => {
                                                            const estCoche = optionsActuellesIds.includes(opt.idOption);
                                                            return (
                                                                <label key={opt.idOption} className="d-flex align-items-center gap-3 border border-dark p-2 bg-light cursor-pointer">
                                                                    <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={estCoche} onChange={(e) => toggleCompatibilite(opt.idOption, e.target.checked)}/>
                                                                    <span className="fw-bold text-uppercase">{opt.nomOption}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Photos */}
                                            <div className="col-12">
                                                <div className="bg-white border border-dark border-2 p-4 shadow-sm">
                                                    <h3 className="text-dark border-bottom border-dark border-2 pb-2 mb-3" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>GALERIE DE PHOTOS</h3>
                                                    {imagesActuelles.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-3 mb-4 p-3 bg-light border border-dark">
                                                            {imagesActuelles.map(img => (
                                                                <div key={img.idImage} className="border border-dark bg-white p-2 text-center" style={{ width: '160px' }}>
                                                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9ECEF' }}>
                                                                        <img src={`/images/produits/${img.nomFichier}?v=${Date.now()}`} alt={img.nomFichier} style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/produits/defaut_produit.png'; }}/>
                                                                    </div>
                                                                    <div className="text-secondary mt-2 fw-bold text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.8rem' }}>Ordre: {img.ordreAffichage}</div>
                                                                    <div className="mt-2 d-flex gap-1">
                                                                        <button type="button" className="btn btn-sm w-100 btn-dark rounded-0 fw-bold py-0" onClick={() => editerImage(img)}>ÉDITER</button>
                                                                        <button type="button" className="btn btn-sm btn-outline-danger rounded-0 fw-bold px-2 py-0" onClick={() => handleSupprimerImage(img.idImage, img.nomFichier)} title="Retirer"><TrashIcon /></button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="bg-light border border-dark p-3">
                                                        <h5 className="fw-bold mb-3 text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem' }}>{idOriginalImage ? 'MODIFIER LA PHOTO' : '+ AJOUTER UNE NOUVELLE PHOTO'}</h5>
                                                        <form onSubmit={handleSauvegarderImage} className="row g-3 align-items-end">

                                                            {/* Champ 1 : Fichier */}
                                                            <div className="col-md-5">
                                                                <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', height: '22px' }}>
                                                                    {idOriginalImage ? 'Remplacer (Optionnel)' : 'Sélectionner l\'image'}
                                                                </label>
                                                                <input type="file" accept="image/*" className="form-control rounded-0 border-dark border-2 p-2 fw-bold bg-white" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem' }} onChange={e => setFichierImage(e.target.files[0])} required={!idOriginalImage} />
                                                            </div>

                                                            {/* Champ 2 : Ordre (Corrigé : plus de décalage vers le haut) */}
                                                            <div className="col-md-2">
                                                                <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', height: '22px' }}>
                                                                    Ordre (1=Premier)
                                                                </label>
                                                                <input type="number" className="form-control rounded-0 border-dark border-2 p-2 fw-bold bg-white" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem' }} value={formDataImage.ordreAffichage} onChange={e => setFormDataImage({...formDataImage, ordreAffichage: e.target.value})} required />
                                                            </div>

                                                            {/* Champ 3 : Modèle */}
                                                            <div className="col-md-5">
                                                                <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', height: '22px' }}>
                                                                    Lier à un modèle
                                                                </label>
                                                                <select className="form-select rounded-0 border-dark border-2 p-2 fw-bold" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.1rem' }} value={formDataImage.idModele} onChange={e => setFormDataImage({...formDataImage, idModele: e.target.value})}>
                                                                    <option value="">(Image Générale)</option>
                                                                    {modelesActuels.map(m => <option key={m.idModele} value={m.idModele}>{m.nomModele}</option>)}
                                                                </select>
                                                            </div>

                                                            <div className="col-12 d-flex gap-2 mt-4">
                                                                <button type="submit" className="btn btn-dark rounded-0 fw-bold px-4 py-2 w-100" style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem' }}>{idOriginalImage ? 'METTRE À JOUR L\'IMAGE' : 'TÉLÉVERSER'}</button>
                                                                {idOriginalImage && <button type="button" className="btn btn-outline-dark rounded-0 fw-bold px-4 py-2" onClick={annulerImage} style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem' }}>ANNULER</button>}
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <BoutonSauvegardeMassif texte={idOriginal ? "ENREGISTRER LA FICHE DE L'ÉQUIPEMENT" : "CRÉER L'ÉQUIPEMENT"} formId="form-equipement" />
                                </div>
                            )}
                        </>
                    )}

                    {/* ONGLET CATÉGORIES */}
                    {ongletActif === 'categories' && (
                        <>
                            {vueCategorie === 'liste' ? (
                                <div>
                                    <TitreSection titre="CATÉGORIES D'ÉQUIPEMENTS" boutonTexte="+ NOUVELLE CATÉGORIE" boutonAction={ouvrirFormulaireCategorie} />
                                    <table className="table table-bordered border-dark bg-white shadow-sm">
                                        <thead style={{ backgroundColor: 'var(--lemark-charcoal)', color: 'white', border: '2px solid black', borderBottom: '4px solid black' }}>
                                        <tr style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                                            <th className="border-dark">ID</th><th className="border-dark">NOM DE LA CATÉGORIE</th><th className="text-end border-dark">ACTIONS</th>
                                        </tr>
                                        </thead>
                                        <tbody style={{ fontFamily: "'Barlow', sans-serif" }}>
                                        {categories.map(cat => (
                                            <tr key={cat.idCategorie} className="align-middle">
                                                <td className="fw-bold text-secondary">#{cat.idCategorie}</td><td className="fw-bold text-uppercase">{cat.nomCategorie}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-dark rounded-0 fw-bold me-2 px-3" onClick={() => editerCategorie(cat)}>ÉDITER</button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger rounded-0 fw-bold px-2" onClick={() => handleSupprimerCategorie(cat.idCategorie, cat.nomCategorie)} title="Retirer"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <form onSubmit={handleSauvegarderCategorie} className="bg-white border border-dark border-2 p-4 shadow-sm h-100 d-flex flex-column">
                                    <TitreSection titre={idOriginalCategorie ? `MODIFIER : ${formDataCategorie.nomCategorie}` : 'CRÉER UNE CATÉGORIE'} boutonTexte="← RETOUR" boutonAction={() => setVueCategorie('liste')} />
                                    <div className="flex-grow-1">
                                        <FormInput label="Nom de la catégorie" value={formDataCategorie.nomCategorie} onChange={e => setFormDataCategorie({...formDataCategorie, nomCategorie: e.target.value})} required />
                                    </div>
                                    <BoutonSauvegardeMassif texte={idOriginalCategorie ? 'ENREGISTRER LA CATÉGORIE' : 'CRÉER LA CATÉGORIE'} />
                                </form>
                            )}
                        </>
                    )}

                    {/* ONGLET OPTIONS */}
                    {ongletActif === 'options' && (
                        <>
                            {vueOption === 'liste' ? (
                                <div>
                                    <TitreSection titre="BANQUE D'OPTIONS" boutonTexte="+ NOUVELLE OPTION" boutonAction={ouvrirFormulaireOption} />
                                    <table className="table table-bordered border-dark bg-white shadow-sm">
                                        <thead style={{ backgroundColor: 'var(--lemark-charcoal)', color: 'white', border: '2px solid black', borderBottom: '4px solid black' }}>
                                        <tr style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                                            <th className="border-dark">ID</th><th className="border-dark">NOM DE L'OPTION</th><th className="border-dark">SKU</th><th className="text-end border-dark">ACTIONS</th>
                                        </tr>
                                        </thead>
                                        <tbody style={{ fontFamily: "'Barlow', sans-serif" }}>
                                        {optionsGlobales.map(opt => (
                                            <tr key={opt.idOption} className="align-middle">
                                                <td className="fw-bold text-secondary">#{opt.idOption}</td><td className="fw-bold text-uppercase">{opt.nomOption}</td><td>{opt.sku}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-dark rounded-0 fw-bold me-2 px-3" onClick={() => editerOption(opt)}>ÉDITER</button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger rounded-0 fw-bold px-2" onClick={() => handleSupprimerOption(opt.idOption, opt.nomOption)} title="Retirer"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <form onSubmit={handleSauvegarderOption} className="bg-white border border-dark border-2 p-4 shadow-sm h-100 d-flex flex-column">
                                    <TitreSection titre={idOriginalOption ? `MODIFIER : ${formDataOption.nomOption}` : 'CRÉER UNE OPTION'} boutonTexte="← RETOUR" boutonAction={() => setVueOption('liste')} />
                                    <div className="flex-grow-1">
                                        <div className="row">
                                            <div className="col-md-8"><FormInput label="Nom de l'accessoire" value={formDataOption.nomOption} onChange={e => setFormDataOption({...formDataOption, nomOption: e.target.value})} required /></div>
                                            <div className="col-md-4"><FormInput label="SKU (Code)" value={formDataOption.sku} onChange={e => setFormDataOption({...formDataOption, sku: e.target.value})} /></div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="fw-bold text-dark mb-1 text-uppercase d-flex align-items-end" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', height: '22px' }}>Description</label>
                                            <textarea className="form-control rounded-0 border-dark border-2 p-2 fw-bold bg-white" style={{ fontFamily: "'Barlow', sans-serif", minHeight: '80px' }} value={formDataOption.descriptionOption} onChange={e => setFormDataOption({...formDataOption, descriptionOption: e.target.value})} />
                                        </div>
                                    </div>
                                    <BoutonSauvegardeMassif texte={idOriginalOption ? 'ENREGISTRER L\'OPTION' : 'CRÉER L\'OPTION'} />
                                </form>
                            )}
                        </>
                    )}

                    {/* ONGLET COMPTES */}
                    {ongletActif === 'comptes' && (
                        <>
                            {vueCompte === 'liste' ? (
                                <div>
                                    <TitreSection titre="ACCÈS ADMINISTRATEURS" boutonTexte="+ NOUVEL ACCÈS" boutonAction={ouvrirFormulaireCompte} />
                                    <table className="table table-bordered border-dark bg-white shadow-sm">
                                        <thead style={{ backgroundColor: 'var(--lemark-charcoal)', color: 'white', border: '2px solid black', borderBottom: '4px solid black' }}>
                                        <tr style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                                            <th className="border-dark">ID</th><th className="border-dark">COURRIEL</th><th className="text-end border-dark">ACTIONS</th>
                                        </tr>
                                        </thead>
                                        <tbody style={{ fontFamily: "'Barlow', sans-serif" }}>
                                        {comptes.map(compte => (
                                            <tr key={compte.idAdmin} className="align-middle">
                                                <td className="fw-bold text-secondary">#{compte.idAdmin}</td>
                                                <td className="fw-bold text-uppercase">{compte.courriel} {compte.courriel === courrielActif && <span className="badge bg-success ms-2 rounded-0">TOI</span>}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-dark rounded-0 fw-bold me-2 px-3" onClick={() => editerCompte(compte)}>ÉDITER</button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger rounded-0 fw-bold px-2" onClick={() => handleSupprimerCompte(compte.idAdmin, compte.courriel)} title="Révoquer"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <form onSubmit={handleSauvegarderCompte} className="bg-white border border-dark border-2 p-4 shadow-sm h-100 d-flex flex-column">
                                    <TitreSection titre={idOriginalCompte ? "MODIFIER L'ACCÈS" : "CRÉER UN NOUVEL ACCÈS"} boutonTexte="← RETOUR" boutonAction={() => setVueCompte('liste')} />
                                    <div className="flex-grow-1">
                                        <div className="row">
                                            <div className="col-md-6"><FormInput type="email" label="Courriel de connexion" value={formDataCompte.courriel} onChange={e => setFormDataCompte({...formDataCompte, courriel: e.target.value})} required /></div>
                                            <div className="col-md-6"><FormInput type="text" label={`Mot de passe ${idOriginalCompte ? '(Laisser vide pour conserver)' : ''}`} value={formDataCompte.motDePasse} onChange={e => setFormDataCompte({...formDataCompte, motDePasse: e.target.value})} required={!idOriginalCompte} /></div>
                                        </div>
                                    </div>
                                    <BoutonSauvegardeMassif texte={idOriginalCompte ? 'ENREGISTRER LE COMPTE' : 'GÉNÉRER LE COMPTE'} />
                                </form>
                            )}
                        </>
                    )}

                    {/* ONGLET PARAMÈTRES SITE */}
                    {ongletActif === 'parametres' && (
                        <form onSubmit={handleSauvegarderParametres} className="bg-white border border-dark border-2 p-4 shadow-sm h-100 d-flex flex-column">
                            <TitreSection titre="PARAMÈTRES GLOBAUX DU SITE" />
                            <div className="flex-grow-1">
                                <div className="p-4 border border-dark bg-light mb-4">
                                    <h4 className="text-dark border-bottom border-dark border-2 pb-2 mb-4" style={{ fontFamily: "'Teko', sans-serif", fontSize: '2rem' }}>BANNIÈRE D'ALERTE (HAUT DE PAGE)</h4>
                                    <div className="mb-4 d-flex align-items-center gap-2">
                                        <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={parametres.banniereActive} onChange={e => setParametres({...parametres, banniereActive: e.target.checked})} />
                                        <span className="fw-bold text-dark text-uppercase" style={{ fontFamily: "'Barlow', sans-serif" }}>Activer la bannière rouge d'urgence globale sur le site</span>
                                    </div>
                                    <FormInput label="Texte de l'alerte (Ex: Fermeture estivale)" value={parametres.banniereTexte} onChange={e => setParametres({...parametres, banniereTexte: e.target.value})} />
                                </div>
                            </div>
                            <BoutonSauvegardeMassif texte="ENREGISTRER LES PARAMÈTRES" />
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // ==========================================
    // ÉCRAN DE CONNEXION (Brut et Industriel)
    // ==========================================
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--lemark-bg-offwhite)', backgroundImage: 'linear-gradient(to right, rgba(24, 25, 27, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 25, 27, 0.035) 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ToastAlert toast={toast} setToast={setToast} />
            <div className="bg-white border border-dark border-3 p-5 shadow-lg" style={{ width: '100%', maxWidth: '500px', boxShadow: '10px 10px 0px rgba(0,0,0,0.2)' }}>
                <div className="border-bottom border-dark border-3 pb-3 mb-4 text-center">
                    <h1 className="text-dark m-0" style={{ fontFamily: "'Teko', sans-serif", fontSize: '5rem', lineHeight: '1' }}>GESTION</h1>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="fw-bold text-dark mb-2 text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', letterSpacing: '1px' }}>UTILISATEUR</label>
                        <input type="email" className="form-control rounded-0 border-dark border-2 p-3 fw-bold fs-5 bg-light" value={courriel} onChange={(e) => setCourriel(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="fw-bold text-dark mb-2 text-uppercase" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', letterSpacing: '1px' }}>MOT DE PASSE</label>
                        <input type="password" className="form-control rounded-0 border-dark border-2 p-3 fw-bold fs-5 bg-light" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-dark fw-bold text-white border-0 py-2 px-5 d-block ms-auto" disabled={chargement} style={{ fontFamily: "'Teko', sans-serif", fontSize: '1.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        {chargement ? '...' : 'OK'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Admin;