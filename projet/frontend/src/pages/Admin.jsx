import { useState, useEffect } from 'react';

function Admin() {
    const [courriel, setCourriel] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreurAuth, setErreurAuth] = useState('');
    const [chargement, setChargement] = useState(false);
    const [jeton, setJeton] = useState(localStorage.getItem('lemark_jwt') || null);
    const [courrielActif, setCourrielActif] = useState(localStorage.getItem('lemark_courriel') || '');

    const [ongletActif, setOngletActif] = useState('equipements');
    const [vueEquipement, setVueEquipement] = useState('liste');
    const [vueOption, setVueOption] = useState('liste');
    const [vueCategorie, setVueCategorie] = useState('liste');
    const [vueCompte, setVueCompte] = useState('liste');

    const [produits, setProduits] = useState([]);
    const [optionsGlobales, setOptionsGlobales] = useState([]);
    const [categories, setCategories] = useState([]);
    const [comptes, setComptes] = useState([]);
    const [parametres, setParametres] = useState({
        banniereActive: false, banniereTexte: '', telephone: '', courriel: '', adresse: '',
        copyrightTexte: '', heuresOuverture: '', lienFacebook: '', texteSeo: ''
    });

    // --- États Formulaires ---
    const [idOriginal, setIdOriginal] = useState(null);
    const formulaireVide = { idProduit: '', nomProduit: '', descriptionCourte: '', descriptionLongue: '', estNouveaute: false, categorie: { idCategorie: '' } };
    const [formData, setFormData] = useState(formulaireVide);

    const formModeleVide = { idModele: '', sku: '', nomModele: '', specifications: '', idProduit: null };
    const [formDataModele, setFormDataModele] = useState(formModeleVide);
    const [idOriginalModele, setIdOriginalModele] = useState(null);

    const formImageVide = { idImage: '', nomFichier: '', ordreAffichage: 1, idModele: '' };    const [formDataImage, setFormDataImage] = useState(formImageVide);
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
    const chargerProduits = () => {
        fetch('http://localhost:8080/api/all_produits')
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur lors du chargement des produits");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProduits(data.sort((a, b) => a.idProduit - b.idProduit));
                } else {
                    setProduits([]);
                }
            })
            .catch(console.error);
    };

    const chargerOptions = () => fetch('http://localhost:8080/api/admin/options', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(setOptionsGlobales).catch(console.error);
    const chargerCategories = () => fetch('http://localhost:8080/api/admin/categories', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(setCategories).catch(console.error);
    const chargerParametres = () => fetch('http://localhost:8080/api/admin/parametres', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(data => { if(data) setParametres(data); }).catch(console.error);
    const chargerComptes = () => fetch('http://localhost:8080/api/admin/comptes', { headers: { 'Authorization': `Bearer ${jeton}` } }).then(res => res.json()).then(data => setComptes(data)).catch(console.error);

    useEffect(() => {
        if (jeton) { chargerProduits(); chargerOptions(); chargerCategories(); chargerParametres(); chargerComptes(); }
    }, [jeton]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErreurAuth(''); setChargement(true);
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
        } catch (err) { setErreurAuth(err.message); } finally { setChargement(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('lemark_jwt'); localStorage.removeItem('lemark_courriel');
        setJeton(null); setCourriel(''); setMotDePasse(''); setCourrielActif('');
    };

    // ==========================================
    // MODULE: COMPTES
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
            if (!res.ok) throw new Error("Erreur de sauvegarde. Ce courriel existe peut-être déjà.");
            if (estModif && formDataCompte.courriel !== courrielActif && comptes.find(c => c.idAdmin === idOriginalCompte)?.courriel === courrielActif) {
                setCourrielActif(formDataCompte.courriel); localStorage.setItem('lemark_courriel', formDataCompte.courriel);
            }
            chargerComptes(); setVueCompte('liste');
        } catch (err) { alert(err.message); }
    };
    const handleSupprimerCompte = async (id, email) => {
        if (email === courrielActif) return alert("Interdit : Tu ne peux pas supprimer ton propre compte.");
        if (!window.confirm(`⚠️ Retirer définitivement l'accès pour "${email}" ?`)) return;
        try { await fetch(`http://localhost:8080/api/admin/comptes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } }); chargerComptes(); } catch (err) { alert(err.message); }
    };

    // ==========================================
    // MODULE: PRODUITS (ÉQUIPEMENTS)
    // ==========================================
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
        if (!formData.idProduit) return alert("L'identifiant du produit est obligatoire.");
        const estModif = idOriginal !== null;
        try {
            const response = await fetch(estModif ? `http://localhost:8080/api/admin/produits/${idOriginal}` : `http://localhost:8080/api/admin/produits`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify({ ...formData, idProduit: parseInt(formData.idProduit) }) });
            if (!response.ok) throw new Error('Erreur de sauvegarde.');
            chargerProduits();
            if (!estModif) setIdOriginal(formData.idProduit); else setVueEquipement('liste');
        } catch (err) { alert(err.message); }
    };
    const handleSupprimerProduit = async (id, nom) => {
        if (!window.confirm(`⚠️ Supprimer l'équipement "${nom}" ?`)) return;
        await fetch(`http://localhost:8080/api/admin/produits/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } }); chargerProduits();
    };
    const toggleCompatibilite = async (idOption, lier) => {
        await fetch(`http://localhost:8080/api/admin/options/produit/${idOriginal}/${lier ? 'lier' : 'retirer'}/${idOption}`, { method: lier ? 'POST' : 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` }}); chargerProduits();
    };

    // ==========================================
    // MODULE: DIMENSIONS (MODÈLES)
    // ==========================================
    const editerModele = (modele) => { setIdOriginalModele(modele.idModele); setFormDataModele({ idModele: modele.idModele, sku: modele.sku || '', nomModele: modele.nomModele || '', specifications: modele.specifications || '', idProduit: idOriginal }); };
    const annulerModele = () => { setIdOriginalModele(null); setFormDataModele(formModeleVide); };
    const handleSauvegarderModele = async (e) => {
        e.preventDefault();
        const estModif = idOriginalModele !== null;
        await fetch(estModif ? `http://localhost:8080/api/admin/modeles/${idOriginalModele}` : `http://localhost:8080/api/admin/modeles`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify({ ...formDataModele, idModele: parseInt(formDataModele.idModele), idProduit: idOriginal }) });
        chargerProduits(); annulerModele();
    };
    const handleSupprimerModele = async (idModele, nom) => {
        if (!window.confirm(`⚠️ Retirer la dimension "${nom}" ?`)) return;
        await fetch(`http://localhost:8080/api/admin/modeles/${idModele}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } }); chargerProduits();
    };

    // ==========================================
    // MODULE: IMAGES (GALERIE & UPLOAD)
    // ==========================================
    // ==========================================
    // MODULE: IMAGES (GALERIE & UPLOAD)
    // ==========================================
    const editerImage = (img) => {
        setIdOriginalImage(img.idImage);
        // On capture le nom du fichier pour ne pas le perdre !
        setFormDataImage({
            idImage: img.idImage,
            nomFichier: img.nomFichier || '',
            ordreAffichage: img.ordreAffichage || 1,
            idModele: img.idModele || ''
        });
        setFichierImage(null);
    };

    const annulerImage = () => {
        setIdOriginalImage(null);
        setFormDataImage(formImageVide);
        setFichierImage(null);
    };

    const handleSauvegarderImage = async (e) => {
        e.preventDefault();
        const estModif = idOriginalImage !== null;

        if (!estModif && !fichierImage) {
            return alert("Veuillez sélectionner un fichier image sur votre ordinateur.");
        }

        const data = new FormData();
        data.append('idImage', formDataImage.idImage);
        data.append('ordreAffichage', formDataImage.ordreAffichage);
        data.append('idProduit', idOriginal);

        // LA CORRECTION EST ICI : On renvoie l'ancien nom si on n'a pas mis de nouveau fichier
        if (formDataImage.nomFichier) {
            data.append('nomFichier', formDataImage.nomFichier);
        }

        if (formDataImage.idModele) data.append('idModele', formDataImage.idModele);
        if (fichierImage) data.append('fichier', fichierImage);

        try {
            // Note: On ne met PAS de 'Content-Type' avec FormData
            const res = await fetch(estModif ? `http://localhost:8080/api/admin/images/${idOriginalImage}` : `http://localhost:8080/api/admin/images`, {
                method: estModif ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${jeton}` },
                body: data
            });
            if (!res.ok) throw new Error("Erreur lors de l'enregistrement de l'image.");

            chargerProduits();
            annulerImage();

            const fileInput = document.getElementById("upload-image-input");
            if (fileInput) fileInput.value = "";
        } catch (err) { alert(err.message); }
    };

    const handleSupprimerImage = async (idImage, nomFichier) => {
        if (!window.confirm(`⚠️ Retirer l'image "${nomFichier}" de ce produit ?`)) return;
        await fetch(`http://localhost:8080/api/admin/images/${idImage}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
        chargerProduits();
    };

    // ==========================================
    // MODULE: OPTIONS GLOBALES (BANQUE)
    // ==========================================
    const ouvrirFormulaireOption = () => { setIdOriginalOption(null); setFormDataOption(formOptionVide); setVueOption('formulaire'); };
    const editerOption = (opt) => { setIdOriginalOption(opt.idOption); setFormDataOption({ idOption: opt.idOption, sku: opt.sku || '', nomOption: opt.nomOption || '', descriptionOption: opt.descriptionOption || '' }); setVueOption('formulaire'); };
    const handleSauvegarderOption = async (e) => {
        e.preventDefault();
        const estModif = idOriginalOption !== null;
        await fetch(estModif ? `http://localhost:8080/api/admin/options/${idOriginalOption}` : `http://localhost:8080/api/admin/options`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify({ ...formDataOption, idOption: parseInt(formDataOption.idOption) }) });
        chargerOptions(); setVueOption('liste');
    };
    const handleSupprimerOption = async (id, nom) => {
        if (!window.confirm(`⚠️ Retirer définitivement l'option "${nom}" ?`)) return;
        await fetch(`http://localhost:8080/api/admin/options/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } }); chargerOptions(); chargerProduits();
    };

    // ==========================================
    // MODULE: CATÉGORIES
    // ==========================================
    const ouvrirFormulaireCategorie = () => { setIdOriginalCategorie(null); setFormDataCategorie(formCategorieVide); setVueCategorie('formulaire'); };
    const editerCategorie = (cat) => { setIdOriginalCategorie(cat.idCategorie); setFormDataCategorie({ idCategorie: cat.idCategorie, nomCategorie: cat.nomCategorie || '' }); setVueCategorie('formulaire'); };
    const handleSauvegarderCategorie = async (e) => {
        e.preventDefault();
        const estModif = idOriginalCategorie !== null;
        await fetch(estModif ? `http://localhost:8080/api/admin/categories/${idOriginalCategorie}` : `http://localhost:8080/api/admin/categories`, { method: estModif ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify({ ...formDataCategorie, idCategorie: parseInt(formDataCategorie.idCategorie) }) });
        chargerCategories(); chargerProduits(); setVueCategorie('liste');
    };
    const handleSupprimerCategorie = async (id, nom) => {
        if (!window.confirm(`⚠️ Retirer la catégorie "${nom}" ?`)) return;
        const res = await fetch(`http://localhost:8080/api/admin/categories/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${jeton}` } });
        if (!res.ok) return alert(`Impossible : Des équipements utilisent encore la catégorie "${nom}".`);
        chargerCategories();
    };

    const handleSauvegarderParametres = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:8080/api/admin/parametres', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jeton}` }, body: JSON.stringify(parametres) });
        alert('Paramètres du site enregistrés avec succès !');
    };

    // Variables sécurisées pour le rendu
    const produitActif = produits.find(p => p.idProduit === idOriginal);
    const modelesActuels = produitActif ? (produitActif.modeles || []) : [];
    // Utilisation de [...] pour trier une copie de l'array et éviter de faire crasher React
    const imagesActuelles = produitActif && produitActif.images ? [...produitActif.images].sort((a, b) => a.ordreAffichage - b.ordreAffichage) : [];
    const optionsActuellesIds = produitActif && produitActif.options ? produitActif.options.map(o => o.idOption) : [];

    if (jeton) {
        return (
            <div className="admin-dashboard-layout">
                {/* --- SIDEBAR --- */}
                <div className="admin-sidebar">
                    <div className="admin-sidebar-header"><h2 className="admin-sidebar-title">Générateur Lemark</h2></div>
                    <button className={`admin-nav-btn ${ongletActif === 'equipements' ? 'active' : ''}`} onClick={() => { setOngletActif('equipements'); setVueEquipement('liste'); }}>Équipements</button>
                    <button className={`admin-nav-btn ${ongletActif === 'categories' ? 'active' : ''}`} onClick={() => { setOngletActif('categories'); setVueCategorie('liste'); }}>Catégories</button>
                    <button className={`admin-nav-btn ${ongletActif === 'options' ? 'active' : ''}`} onClick={() => { setOngletActif('options'); setVueOption('liste'); }}>Options & Access.</button>
                    <button className={`admin-nav-btn ${ongletActif === 'parametres' ? 'active' : ''}`} onClick={() => setOngletActif('parametres')}>Paramètres du site</button>
                    <button className={`admin-nav-btn ${ongletActif === 'comptes' ? 'active' : ''}`} onClick={() => { setOngletActif('comptes'); setVueCompte('liste'); }}>Accès & Sécurité</button>
                    <div className="admin-logout-zone"><button onClick={handleLogout} className="btn-admin-logout">Verrouiller & Sortir</button></div>
                </div>

                <div className="admin-content-area">
                    {/* ========================================================= */}
                    {/* ONGLET : COMPTES ADMINISTRATEURS                          */}
                    {/* ========================================================= */}
                    {ongletActif === 'comptes' && (
                        <>
                            {vueCompte === 'liste' ? (
                                <>
                                    <div className="admin-content-header">
                                        <h1 className="admin-content-title">Comptes Administrateurs</h1>
                                        <button className="btn-admin-add" onClick={ouvrirFormulaireCompte}>+ Nouvel Accès</button>
                                    </div>
                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>ID</th>
                                                <th>Courriel de connexion</th>
                                                <th>Date de création</th>
                                                <th style={{ width: '200px', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {comptes.map(compte => (
                                                <tr key={compte.idAdmin}>
                                                    <td className="text-secondary fw-bolder">#{compte.idAdmin}</td>
                                                    <td className="fw-bolder text-dark" style={{ fontSize: '1.05rem' }}>{compte.courriel} {compte.courriel === courrielActif && <span className="badge bg-success ms-2">Toi</span>}</td>
                                                    <td className="text-secondary">{new Date(compte.dateCreation).toLocaleDateString('fr-CA')}</td>
                                                    <td>
                                                        <div className="admin-action-group justify-content-end">
                                                            <button className="btn-action-sm btn-action-edit" onClick={() => editerCompte(compte)}>ÉDITER</button>
                                                            <button className="btn-action-sm btn-action-delete" onClick={() => handleSupprimerCompte(compte.idAdmin, compte.courriel)}>RÉVOQUER</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="admin-form-container">
                                    <h2 className="admin-content-title mb-4">{idOriginalCompte ? "Modification du compte" : "Créer un nouvel accès"}</h2>
                                    <form onSubmit={handleSauvegarderCompte}>
                                        <div className="row">
                                            <div className="col-md-6 admin-form-group">
                                                <label className="admin-form-label">Courriel de connexion</label>
                                                <input type="email" className="admin-input" value={formDataCompte.courriel} onChange={e => setFormDataCompte({...formDataCompte, courriel: e.target.value})} required />
                                            </div>
                                            <div className="col-md-6 admin-form-group">
                                                <label className="admin-form-label">Mot de passe {idOriginalCompte && <span className="text-secondary ms-2 text-lowercase" style={{ fontSize: '0.75rem' }}>(Laisser vide pour conserver l'actuel)</span>}</label>
                                                <input type="text" className="admin-input" value={formDataCompte.motDePasse} onChange={e => setFormDataCompte({...formDataCompte, motDePasse: e.target.value})} placeholder={idOriginalCompte ? "••••••••" : "Requis"} required={!idOriginalCompte} />
                                            </div>
                                        </div>
                                        <div className="admin-form-actions">
                                            <button type="button" className="btn-admin-cancel" onClick={() => setVueCompte('liste')}>Annuler</button>
                                            <button type="submit" className="btn-admin-save">{idOriginalCompte ? "Mettre à jour" : "Générer l'accès"}</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {/* ========================================================= */}
                    {/* ONGLET : ÉQUIPEMENTS                                      */}
                    {/* ========================================================= */}
                    {ongletActif === 'equipements' && (
                        <>
                            {vueEquipement === 'liste' ? (
                                <>
                                    <div className="admin-content-header">
                                        <h1 className="admin-content-title">Inventaire des équipements</h1>
                                        <button className="btn-admin-add" onClick={ouvrirFormulaireAjout}>+ Nouvel Équipement</button>
                                    </div>
                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>ID</th>
                                                <th>Nom de l'équipement</th>
                                                <th>Catégorie</th>
                                                <th style={{ width: '220px', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {produits.map(prod => (
                                                <tr key={prod.idProduit}>
                                                    <td className="text-secondary fw-bolder">#{prod.idProduit}</td>
                                                    <td className="fw-bolder text-dark" style={{ fontSize: '1.05rem' }}>{prod.nomProduit}</td>
                                                    <td>{prod.categorie ? prod.categorie.nomCategorie : '-'}</td>
                                                    <td>
                                                        <div className="admin-action-group justify-content-end">
                                                            <button className="btn-action-sm btn-action-edit" onClick={() => ouvrirFormulaireModification(prod)}>ÉDITER</button>
                                                            <button className="btn-action-sm btn-action-delete" onClick={() => handleSupprimerProduit(prod.idProduit, prod.nomProduit)}>RETIRER</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div className="admin-form-container mb-4">
                                        <h2 className="admin-content-title mb-4">{idOriginal ? `Fiche : ${formData.nomProduit}` : 'Création d\'un nouvel équipement'}</h2>
                                        <form onSubmit={handleSauvegarderProduit}>
                                            <div className="row">
                                                <div className="col-md-2 admin-form-group">
                                                    <label className="admin-form-label text-danger">ID</label>
                                                    <input type="number" className="admin-input border-danger" value={formData.idProduit} onChange={e => setFormData({...formData, idProduit: e.target.value})} required />
                                                </div>
                                                <div className="col-md-6 admin-form-group">
                                                    <label className="admin-form-label">Nom de l'équipement</label>
                                                    <input type="text" className="admin-input" value={formData.nomProduit} onChange={e => setFormData({...formData, nomProduit: e.target.value})} required />
                                                </div>
                                                <div className="col-md-4 admin-form-group">
                                                    <label className="admin-form-label">Catégorie</label>
                                                    <select className="admin-select" value={formData.categorie.idCategorie} onChange={e => setFormData({...formData, categorie: { idCategorie: parseInt(e.target.value) }})} required>
                                                        {categories.map(cat => <option key={cat.idCategorie} value={cat.idCategorie}>{cat.nomCategorie}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="admin-form-group mb-4">
                                                <label className="admin-checkbox-wrapper" style={{ width: 'fit-content' }}>
                                                    <input type="checkbox" className="admin-checkbox" checked={formData.estNouveaute} onChange={e => setFormData({...formData, estNouveaute: e.target.checked})}/>
                                                    <span className="fw-bolder">Afficher l'étiquette "Nouveauté"</span>
                                                </label>
                                            </div>
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Description Courte</label>
                                                <input type="text" className="admin-input" value={formData.descriptionCourte} onChange={e => setFormData({...formData, descriptionCourte: e.target.value})} />
                                            </div>
                                            <div className="admin-form-group">
                                                <label className="admin-form-label">Description Longue</label>
                                                <textarea className="admin-textarea" value={formData.descriptionLongue} onChange={e => setFormData({...formData, descriptionLongue: e.target.value})} />
                                            </div>
                                            <div className="admin-form-actions">
                                                <button type="button" className="btn-admin-cancel" onClick={() => setVueEquipement('liste')}>Retour au catalogue</button>
                                                <button type="submit" className="btn-admin-save">{idOriginal ? 'Mettre à jour la fiche' : 'Créer et configurer'}</button>
                                            </div>
                                        </form>
                                    </div>

                                    {idOriginal && (
                                        <div className="row g-4">
                                            {/* ===================== DIMENSIONS ===================== */}
                                            <div className="col-lg-7">
                                                <div className="admin-form-container h-100" style={{ borderTop: '5px solid #18191B' }}>
                                                    <h2 className="admin-content-title mb-4" style={{ fontSize: '1.5rem' }}>Déclinaisons (Dimensions)</h2>
                                                    {modelesActuels.length > 0 && (
                                                        <table className="admin-table border mb-4">
                                                            <thead style={{ backgroundColor: '#EDEFF2' }}>
                                                            <tr>
                                                                <th style={{ color: '#18191B' }}>ID</th>
                                                                <th style={{ color: '#18191B' }}>Code</th>
                                                                <th style={{ color: '#18191B' }}>Nom</th>
                                                                <th style={{ color: '#18191B' }}>Specs</th>
                                                                <th style={{ color: '#18191B', textAlign: 'right' }}>Actions</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {modelesActuels.map(mod => (
                                                                <tr key={mod.idModele}>
                                                                    <td className="fw-bold">#{mod.idModele}</td>
                                                                    <td>{mod.sku}</td>
                                                                    <td className="fw-bolder">{mod.nomModele}</td>
                                                                    <td>{mod.specifications}</td>
                                                                    <td className="text-end">
                                                                        <button className="btn-action-sm btn-action-edit me-1" onClick={() => editerModele(mod)}>ÉDITER</button>
                                                                        <button className="btn-action-sm btn-action-delete" onClick={() => handleSupprimerModele(mod.idModele, mod.nomModele)}>X</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                    <div className="p-3 bg-light border rounded-3">
                                                        <h5 className="fw-bold mb-3">{idOriginalModele ? 'Modifier la grandeur' : '+ Ajouter une grandeur'}</h5>
                                                        <form onSubmit={handleSauvegarderModele} className="row g-2 align-items-end">
                                                            <div className="col-4"><label className="admin-form-label text-danger">ID</label><input type="number" className="admin-input p-1" value={formDataModele.idModele} onChange={e => setFormDataModele({...formDataModele, idModele: e.target.value})} required /></div>
                                                            <div className="col-4"><label className="admin-form-label">Code (SKU)</label><input type="text" className="admin-input p-1" value={formDataModele.sku} onChange={e => setFormDataModele({...formDataModele, sku: e.target.value})} /></div>
                                                            <div className="col-4"><label className="admin-form-label">Nom</label><input type="text" className="admin-input p-1" value={formDataModele.nomModele} onChange={e => setFormDataModele({...formDataModele, nomModele: e.target.value})} required /></div>
                                                            <div className="col-12"><label className="admin-form-label">Dimensions (Ex: 48 po)</label><input type="text" className="admin-input p-1" value={formDataModele.specifications} onChange={e => setFormDataModele({...formDataModele, specifications: e.target.value})} required /></div>
                                                            <div className="col-12 mt-2">
                                                                <button type="submit" className="btn btn-dark fw-bold w-100">{idOriginalModele ? 'Mettre à jour' : 'Ajouter'}</button>
                                                                {idOriginalModele && <button type="button" className="btn btn-outline-secondary fw-bold w-100 mt-2" onClick={annulerModele}>Annuler</button>}
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ===================== OPTIONS COMPATIBLES ===================== */}
                                            <div className="col-lg-5">
                                                <div className="admin-form-container h-100" style={{ borderTop: '5px solid var(--lemark-yellow)' }}>
                                                    <h2 className="admin-content-title mb-4" style={{ fontSize: '1.5rem' }}>Options compatibles</h2>
                                                    <div className="d-flex flex-column gap-2">
                                                        {optionsGlobales.map(opt => {
                                                            const estCoche = optionsActuellesIds.includes(opt.idOption);
                                                            return (
                                                                <label key={opt.idOption} className="admin-checkbox-wrapper" style={{ padding: '0.6rem 1rem' }}>
                                                                    <input type="checkbox" className="admin-checkbox" checked={estCoche} onChange={(e) => toggleCompatibilite(opt.idOption, e.target.checked)}/>
                                                                    <span className="fw-bold">{opt.nomOption}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ===================== GALERIE DE PHOTOS ===================== */}
                                            <div className="col-12">
                                                <div className="admin-form-container" style={{ borderTop: '5px solid #CED4DA' }}>
                                                    <h2 className="admin-content-title mb-4" style={{ fontSize: '1.5rem' }}>Galerie de photos</h2>

                                                    {imagesActuelles.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-3 mb-4 p-3 bg-light border rounded">
                                                            {imagesActuelles.map(img => (
                                                                <div key={img.idImage} className="border bg-white rounded p-2 text-center shadow-sm" style={{ width: '160px' }}>
                                                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        {/* Ajout de ?v=Date.now() pour contrer le cache des images de Vite */}
                                                                        <img src={`/images/produits/${img.nomFichier}?v=${Date.now()}`} alt={img.nomFichier} style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }}
                                                                             onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/produits/defaut_produit.png'; }}/>
                                                                    </div>
                                                                    <div className="fw-bold small text-truncate mt-2" title={img.nomFichier}>{img.nomFichier}</div>
                                                                    <div className="text-secondary mt-1" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                                                                        <span className="d-block">Ordre : {img.ordreAffichage}</span>
                                                                        <span className="d-block text-truncate">Liée à : {img.idModele && img.idModele !== 0 ? modelesActuels.find(m => m.idModele === img.idModele)?.nomModele : 'Général'}</span>
                                                                    </div>
                                                                    <div className="mt-2 d-flex justify-content-center gap-1">
                                                                        <button className="btn-action-sm btn-action-edit px-2 py-1" onClick={() => editerImage(img)}>ÉDITER</button>
                                                                        <button className="btn-action-sm btn-action-delete px-2 py-1" onClick={() => handleSupprimerImage(img.idImage, img.nomFichier)}>X</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="p-3 bg-light border rounded-3">
                                                        <h5 className="fw-bold mb-3">{idOriginalImage ? 'Modifier la photo' : '+ Ajouter une nouvelle photo depuis l\'ordinateur'}</h5>
                                                        <form onSubmit={handleSauvegarderImage} className="row g-2 align-items-end">
                                                            <div className="col-md-2">
                                                                <label className="admin-form-label text-danger">ID Image</label>
                                                                <input type="number" className="admin-input p-1" value={formDataImage.idImage} onChange={e => setFormDataImage({...formDataImage, idImage: e.target.value})} required />
                                                            </div>

                                                            <div className="col-md-4">
                                                                <label className="admin-form-label">{idOriginalImage ? 'Remplacer le fichier (Optionnel)' : 'Sélectionner le fichier'}</label>
                                                                <input id="upload-image-input" type="file" accept="image/*" className="admin-input p-1 bg-white" onChange={e => setFichierImage(e.target.files[0])} required={!idOriginalImage} />
                                                            </div>

                                                            <div className="col-md-2">
                                                                <label className="admin-form-label">Ordre (1=Premier)</label>
                                                                <input type="number" className="admin-input p-1" value={formDataImage.ordreAffichage} onChange={e => setFormDataImage({...formDataImage, ordreAffichage: e.target.value})} required />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="admin-form-label">Lier à un modèle (Optionnel)</label>
                                                                <select className="admin-select p-1" value={formDataImage.idModele} onChange={e => setFormDataImage({...formDataImage, idModele: e.target.value})}>
                                                                    <option value="">Image Générale</option>
                                                                    {modelesActuels.map(m => <option key={m.idModele} value={m.idModele}>{m.nomModele} ({m.sku})</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="col-12 mt-3 d-flex gap-2">
                                                                <button type="submit" className="btn btn-dark fw-bold px-4 py-2 w-100">{idOriginalImage ? 'Mettre à jour l\'image' : 'Téléverser et Ajouter'}</button>
                                                                {idOriginalImage && <button type="button" className="btn btn-outline-secondary fw-bold px-4 py-2 w-100" onClick={annulerImage}>Annuler</button>}
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* ========================================================= */}
                    {/* ONGLET : OPTIONS & ACCESSOIRES                            */}
                    {/* ========================================================= */}
                    {ongletActif === 'options' && (
                        <>
                            {vueOption === 'liste' ? (
                                <>
                                    <div className="admin-content-header">
                                        <h1 className="admin-content-title">Banque d'options (Accessoires)</h1>
                                        <button className="btn-admin-add" onClick={ouvrirFormulaireOption}>+ Nouvelle Option</button>
                                    </div>
                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>ID</th>
                                                <th>Code (SKU)</th>
                                                <th>Nom de l'option</th>
                                                <th>Description</th>
                                                <th style={{ width: '220px', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {optionsGlobales.map(opt => (
                                                <tr key={opt.idOption}>
                                                    <td className="text-secondary fw-bolder">#{opt.idOption}</td>
                                                    <td className="text-secondary">{opt.sku}</td>
                                                    <td className="fw-bolder text-dark" style={{ fontSize: '1.05rem' }}>{opt.nomOption}</td>
                                                    <td className="text-secondary small">{opt.descriptionOption}</td>
                                                    <td>
                                                        <div className="admin-action-group justify-content-end">
                                                            <button className="btn-action-sm btn-action-edit" onClick={() => editerOption(opt)}>ÉDITER</button>
                                                            <button className="btn-action-sm btn-action-delete" onClick={() => handleSupprimerOption(opt.idOption, opt.nomOption)}>RETIRER</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="admin-form-container">
                                    <h2 className="admin-content-title mb-4">{idOriginalOption ? `Modification : ${formDataOption.nomOption}` : 'Création d\'une option'}</h2>
                                    <form onSubmit={handleSauvegarderOption}>
                                        <div className="row">
                                            <div className="col-md-2 admin-form-group">
                                                <label className="admin-form-label text-danger">ID</label>
                                                <input type="number" className="admin-input border-danger" value={formDataOption.idOption} onChange={e => setFormDataOption({...formDataOption, idOption: e.target.value})} required />
                                            </div>
                                            <div className="col-md-4 admin-form-group">
                                                <label className="admin-form-label">Code (SKU)</label>
                                                <input type="text" className="admin-input" value={formDataOption.sku} onChange={e => setFormDataOption({...formDataOption, sku: e.target.value})} />
                                            </div>
                                            <div className="col-md-6 admin-form-group">
                                                <label className="admin-form-label">Nom de l'accessoire</label>
                                                <input type="text" className="admin-input" value={formDataOption.nomOption} onChange={e => setFormDataOption({...formDataOption, nomOption: e.target.value})} required />
                                            </div>
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Description</label>
                                            <textarea className="admin-textarea" value={formDataOption.descriptionOption} onChange={e => setFormDataOption({...formDataOption, descriptionOption: e.target.value})} style={{ minHeight: '80px' }}/>
                                        </div>
                                        <div className="admin-form-actions">
                                            <button type="button" className="btn-admin-cancel" onClick={() => setVueOption('liste')}>Annuler</button>
                                            <button type="submit" className="btn-admin-save">{idOriginalOption ? 'Mettre à jour' : 'Ajouter à la banque'}</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {/* ========================================================= */}
                    {/* ONGLET : CATÉGORIES                                       */}
                    {/* ========================================================= */}
                    {ongletActif === 'categories' && (
                        <>
                            {vueCategorie === 'liste' ? (
                                <>
                                    <div className="admin-content-header">
                                        <h1 className="admin-content-title">Catégories d'équipements</h1>
                                        <button className="btn-admin-add" onClick={ouvrirFormulaireCategorie}>+ Nouvelle Catégorie</button>
                                    </div>
                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>ID</th>
                                                <th>Nom de la catégorie</th>
                                                <th style={{ width: '220px', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {categories.map(cat => (
                                                <tr key={cat.idCategorie}>
                                                    <td className="text-secondary fw-bolder">#{cat.idCategorie}</td>
                                                    <td className="fw-bolder text-dark" style={{ fontSize: '1.05rem' }}>{cat.nomCategorie}</td>
                                                    <td>
                                                        <div className="admin-action-group justify-content-end">
                                                            <button className="btn-action-sm btn-action-edit" onClick={() => editerCategorie(cat)}>ÉDITER</button>
                                                            <button className="btn-action-sm btn-action-delete" onClick={() => handleSupprimerCategorie(cat.idCategorie, cat.nomCategorie)}>RETIRER</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="admin-form-container">
                                    <h2 className="admin-content-title mb-4">{idOriginalCategorie ? `Modification : ${formDataCategorie.nomCategorie}` : 'Création d\'une catégorie'}</h2>
                                    <form onSubmit={handleSauvegarderCategorie}>
                                        <div className="row">
                                            <div className="col-md-3 admin-form-group">
                                                <label className="admin-form-label text-danger">ID</label>
                                                <input type="number" className="admin-input border-danger" value={formDataCategorie.idCategorie} onChange={e => setFormDataCategorie({...formDataCategorie, idCategorie: e.target.value})} required />
                                            </div>
                                            <div className="col-md-9 admin-form-group">
                                                <label className="admin-form-label">Nom de la catégorie</label>
                                                <input type="text" className="admin-input" value={formDataCategorie.nomCategorie} onChange={e => setFormDataCategorie({...formDataCategorie, nomCategorie: e.target.value})} required />
                                            </div>
                                        </div>
                                        <div className="admin-form-actions">
                                            <button type="button" className="btn-admin-cancel" onClick={() => setVueCategorie('liste')}>Annuler</button>
                                            <button type="submit" className="btn-admin-save">{idOriginalCategorie ? 'Mettre à jour' : 'Créer la catégorie'}</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {/* ========================================================= */}
                    {/* ONGLET : PARAMÈTRES SITE                                  */}
                    {/* ========================================================= */}
                    {ongletActif === 'parametres' && (
                        <div className="admin-form-container">
                            <h1 className="admin-content-title mb-2">Paramètres globaux</h1>
                            <p className="text-secondary fw-bold mb-4">Ces informations s'affichent partout sur le site (navigation, fiches produits, bas de page).</p>

                            <form onSubmit={handleSauvegarderParametres}>
                                <h4 className="fw-bold mt-4 mb-3 border-bottom pb-2">1. Bannière d'alerte (Haut de page)</h4>
                                <div className="admin-form-group mb-4">
                                    <label className="admin-checkbox-wrapper" style={{ width: 'fit-content' }}>
                                        <input type="checkbox" className="admin-checkbox" checked={parametres.banniereActive} onChange={e => setParametres({...parametres, banniereActive: e.target.checked})} />
                                        <span className="fw-bolder">Activer la bannière d'alerte rouge sur le site public</span>
                                    </label>
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Texte de l'alerte</label>
                                    <input type="text" className="admin-input" value={parametres.banniereTexte} onChange={e => setParametres({...parametres, banniereTexte: e.target.value})} />
                                </div>

                                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">2. Coordonnées de l'entreprise</h4>
                                <div className="row">
                                    <div className="col-md-6 admin-form-group">
                                        <label className="admin-form-label">Numéro de téléphone principal</label>
                                        <input type="text" className="admin-input" value={parametres.telephone} onChange={e => setParametres({...parametres, telephone: e.target.value})} />
                                    </div>
                                    <div className="col-md-6 admin-form-group">
                                        <label className="admin-form-label">Courriel de contact</label>
                                        <input type="email" className="admin-input" value={parametres.courriel} onChange={e => setParametres({...parametres, courriel: e.target.value})} />
                                    </div>
                                    <div className="col-12 admin-form-group">
                                        <label className="admin-form-label">Adresse de l'usine / bureau</label>
                                        <input type="text" className="admin-input" value={parametres.adresse} onChange={e => setParametres({...parametres, adresse: e.target.value})} />
                                    </div>
                                </div>

                                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">3. Informations complémentaires</h4>
                                <div className="row">
                                    <div className="col-md-6 admin-form-group">
                                        <label className="admin-form-label">Heures d'ouverture</label>
                                        <input type="text" className="admin-input" value={parametres.heuresOuverture} onChange={e => setParametres({...parametres, heuresOuverture: e.target.value})} />
                                    </div>
                                    <div className="col-md-6 admin-form-group">
                                        <label className="admin-form-label">Lien Facebook</label>
                                        <input type="text" className="admin-input" value={parametres.lienFacebook} onChange={e => setParametres({...parametres, lienFacebook: e.target.value})} />
                                    </div>
                                </div>

                                <h4 className="fw-bold mt-5 mb-3 border-bottom pb-2">4. Pied de page & Référencement Google</h4>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Mention de droits d'auteur (Copyright)</label>
                                    <input type="text" className="admin-input" value={parametres.copyrightTexte} onChange={e => setParametres({...parametres, copyrightTexte: e.target.value})} />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Texte invisible SEO</label>
                                    <textarea className="admin-textarea" value={parametres.texteSeo} onChange={e => setParametres({...parametres, texteSeo: e.target.value})} style={{ minHeight: '80px' }}/>
                                </div>

                                <div className="admin-form-actions mt-4">
                                    <button type="submit" className="btn-admin-save w-100">Sauvegarder les paramètres</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Vue Login Terminal incluse plus haut
    return (
        <div className="admin-terminal-wrapper">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h1 className="admin-login-title">Accès Sécurisé</h1>
                    <span className="text-secondary fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>SYSTÈME DE GESTION LEMARK</span>
                </div>
                {erreurAuth && <div className="alert alert-danger fw-bold border-2 mb-4" role="alert">{erreurAuth}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="fw-bolder mb-2 text-uppercase" style={{ fontSize: '0.85rem' }}>Courriel administrateur</label>
                        <input type="email" className="admin-input-heavy" value={courriel} onChange={(e) => setCourriel(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="fw-bolder mb-2 text-uppercase" style={{ fontSize: '0.85rem' }}>Mot de passe</label>
                        <input type="password" className="admin-input-heavy" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-admin-login mt-2" disabled={chargement}>
                        {chargement ? 'Vérification...' : 'Déverrouiller le système'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Admin;