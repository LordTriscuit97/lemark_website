import { useState, useEffect } from 'react';

function Admin() {
    const [courriel, setCourriel] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreurAuth, setErreurAuth] = useState('');
    const [chargement, setChargement] = useState(false);
    const [jeton, setJeton] = useState(localStorage.getItem('lemark_jwt') || null);

    const [ongletActif, setOngletActif] = useState('equipements');
    const [vueEquipement, setVueEquipement] = useState('liste');
    const [produits, setProduits] = useState([]);

    // Ajout d'une variable pour se souvenir de l'ID d'origine lors d'une modification
    const [idOriginal, setIdOriginal] = useState(null);

    const categoriesDisponibles = [
        { id: 1, nom: 'Surfaceuses' },
        { id: 2, nom: 'Rouleaux & Compacteurs' },
        { id: 3, nom: 'Débuscage & Foresterie' },
        { id: 4, nom: 'Remorques' },
        { id: 5, nom: 'Niveleuses & Herses' },
        { id: 6, nom: 'Foyers Extérieurs' }
    ];

    const formulaireVide = {
        idProduit: '', // Changé en texte vide pour le champ input
        nomProduit: '',
        descriptionCourte: '',
        descriptionLongue: '',
        estNouveaute: false,
        categorie: { idCategorie: 1 }
    };
    const [formData, setFormData] = useState(formulaireVide);

    const chargerProduits = () => {
        fetch('http://localhost:8080/api/all_produits')
            .then(res => res.json())
            .then(data => {
                const produitsTries = data.sort((a, b) => a.idProduit - b.idProduit);
                setProduits(produitsTries);
            })
            .catch(err => console.error("Erreur de chargement:", err));
    };

    useEffect(() => {
        if (jeton && ongletActif === 'equipements') {
            chargerProduits();
        }
    }, [jeton, ongletActif]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErreurAuth('');
        setChargement(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courriel, motDePasse }),
            });

            if (!response.ok) throw new Error('Identifiants incorrects ou accès refusé.');

            const data = await response.json();
            localStorage.setItem('lemark_jwt', data.token);
            setJeton(data.token);
        } catch (err) {
            setErreurAuth(err.message);
        } finally {
            setChargement(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('lemark_jwt');
        setJeton(null);
        setCourriel('');
        setMotDePasse('');
    };

    const ouvrirFormulaireAjout = () => {
        setIdOriginal(null); // Mode création pure
        setFormData(formulaireVide);
        setVueEquipement('formulaire');
    };

    const ouvrirFormulaireModification = (produit) => {
        setIdOriginal(produit.idProduit); // On mémorise l'ID avant toute modification
        setFormData({
            idProduit: produit.idProduit,
            nomProduit: produit.nomProduit || '',
            descriptionCourte: produit.descriptionCourte || '',
            descriptionLongue: produit.descriptionLongue || '',
            estNouveaute: produit.estNouveaute || false,
            categorie: { idCategorie: produit.categorie ? produit.categorie.idCategorie : 1 }
        });
        setVueEquipement('formulaire');
    };

    const handleSauvegarderProduit = async (e) => {
        e.preventDefault();

        // Validation basique
        if (!formData.idProduit) {
            alert("L'identifiant du produit est obligatoire.");
            return;
        }

        const estModification = idOriginal !== null;
        // Si c'est une modification, on tape sur l'URL avec l'ANCIEN ID
        const url = estModification
            ? `http://localhost:8080/api/admin/produits/${idOriginal}`
            : `http://localhost:8080/api/admin/produits`;

        const methode = estModification ? 'PUT' : 'POST';

        // Conversion sécuritaire de l'ID en entier pour l'API
        const donneesAEnvoyer = {
            ...formData,
            idProduit: parseInt(formData.idProduit)
        };

        try {
            const response = await fetch(url, {
                method: methode,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jeton}`
                },
                body: JSON.stringify(donneesAEnvoyer),
            });

            if (!response.ok) {
                if (response.status === 500) throw new Error("Cet ID existe peut-être déjà ou une erreur serveur est survenue.");
                throw new Error('Erreur lors de la sauvegarde du produit.');
            }

            chargerProduits();
            setVueEquipement('liste');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSupprimerProduit = async (id, nom) => {
        const confirmation = window.confirm(`⚠️ ATTENTION : Es-tu certain de vouloir supprimer l'équipement "${nom}" (ID: ${id}) ?\nCette action est irréversible.`);
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/produits/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${jeton}` }
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression.');
            chargerProduits();
        } catch (err) {
            alert(err.message);
        }
    };

    if (jeton) {
        return (
            <div className="admin-dashboard-layout">
                {/* Navigation latérale */}
                <div className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <h2 className="admin-sidebar-title">Générateur Lemark</h2>
                    </div>

                    <button
                        className={`admin-nav-btn ${ongletActif === 'equipements' ? 'active' : ''}`}
                        onClick={() => { setOngletActif('equipements'); setVueEquipement('liste'); }}
                    >
                        Équipements
                    </button>
                    <button
                        className={`admin-nav-btn ${ongletActif === 'categories' ? 'active' : ''}`}
                        onClick={() => setOngletActif('categories')}
                    >
                        Catégories
                    </button>
                    <button
                        className={`admin-nav-btn ${ongletActif === 'options' ? 'active' : ''}`}
                        onClick={() => setOngletActif('options')}
                    >
                        Options & Access.
                    </button>

                    <div className="admin-logout-zone">
                        <button onClick={handleLogout} className="btn-admin-logout">
                            Verrouiller & Sortir
                        </button>
                    </div>
                </div>

                {/* Zone de travail Centrale */}
                <div className="admin-content-area">
                    {ongletActif === 'equipements' && (
                        <>
                            {vueEquipement === 'liste' ? (
                                <>
                                    <div className="admin-content-header">
                                        <h1 className="admin-content-title">Inventaire des équipements</h1>
                                        <button className="btn-admin-add" onClick={ouvrirFormulaireAjout}>
                                            + Nouvel Équipement
                                        </button>
                                    </div>

                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>ID</th>
                                                <th>Nom de l'équipement</th>
                                                <th>Catégorie</th>
                                                <th>Nouveauté</th>
                                                <th style={{ width: '220px', textAlign: 'right' }}>Usinage (Actions)</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {produits.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5 fw-bold text-secondary">
                                                        Aucun équipement ou chargement en cours...
                                                    </td>
                                                </tr>
                                            ) : (
                                                produits.map(prod => (
                                                    <tr key={prod.idProduit}>
                                                        <td className="text-secondary fw-bolder">#{prod.idProduit}</td>
                                                        <td className="fw-bolder text-dark" style={{ fontSize: '1.05rem' }}>{prod.nomProduit}</td>
                                                        <td>{prod.categorie ? prod.categorie.nomCategorie : '-'}</td>
                                                        <td>
                                                            {prod.estNouveaute ? (
                                                                <span className="badge bg-danger rounded-1 p-2">OUI</span>
                                                            ) : (
                                                                <span className="badge bg-secondary rounded-1 opacity-50 p-2">NON</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="admin-action-group justify-content-end">
                                                                <button
                                                                    className="btn-action-sm btn-action-edit"
                                                                    onClick={() => ouvrirFormulaireModification(prod)}
                                                                >
                                                                    MODIFIER
                                                                </button>
                                                                <button
                                                                    className="btn-action-sm btn-action-delete"
                                                                    onClick={() => handleSupprimerProduit(prod.idProduit, prod.nomProduit)}
                                                                >
                                                                    SUPPRIMER
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="admin-form-container">
                                    <h2 className="admin-content-title mb-4">
                                        {idOriginal ? `Modification : ${formData.nomProduit}` : 'Création d\'un nouvel équipement'}
                                    </h2>

                                    <form onSubmit={handleSauvegarderProduit}>
                                        <div className="row">
                                            {/* CHAMP ID MANUEL */}
                                            <div className="col-md-2 admin-form-group">
                                                <label className="admin-form-label text-danger">ID (Code unique)</label>
                                                <input
                                                    type="number"
                                                    className="admin-input border-danger"
                                                    value={formData.idProduit}
                                                    onChange={e => setFormData({...formData, idProduit: e.target.value})}
                                                    placeholder="Ex: 301"
                                                    required
                                                />
                                            </div>

                                            {/* Nom du produit */}
                                            <div className="col-md-6 admin-form-group">
                                                <label className="admin-form-label">Nom complet de l'équipement</label>
                                                <input
                                                    type="text"
                                                    className="admin-input"
                                                    value={formData.nomProduit}
                                                    onChange={e => setFormData({...formData, nomProduit: e.target.value})}
                                                    required
                                                />
                                            </div>

                                            {/* Catégorie */}
                                            <div className="col-md-4 admin-form-group">
                                                <label className="admin-form-label">Catégorie</label>
                                                <select
                                                    className="admin-select"
                                                    value={formData.categorie.idCategorie}
                                                    onChange={e => setFormData({...formData, categorie: { idCategorie: parseInt(e.target.value) }})}
                                                >
                                                    {categoriesDisponibles.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Nouveauté */}
                                        <div className="admin-form-group mb-4">
                                            <label className="admin-checkbox-wrapper" style={{ width: 'fit-content' }}>
                                                <input
                                                    type="checkbox"
                                                    className="admin-checkbox"
                                                    checked={formData.estNouveaute}
                                                    onChange={e => setFormData({...formData, estNouveaute: e.target.checked})}
                                                />
                                                <span className="fw-bolder">Marquer cet équipement comme une "Nouveauté"</span>
                                            </label>
                                        </div>

                                        {/* Description Courte */}
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Description Courte (Visible au premier coup d'œil)</label>
                                            <input
                                                type="text"
                                                className="admin-input"
                                                value={formData.descriptionCourte}
                                                onChange={e => setFormData({...formData, descriptionCourte: e.target.value})}
                                            />
                                        </div>

                                        {/* Description Longue */}
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Description Longue (Détails complets de conception)</label>
                                            <textarea
                                                className="admin-textarea"
                                                value={formData.descriptionLongue}
                                                onChange={e => setFormData({...formData, descriptionLongue: e.target.value})}
                                            />
                                        </div>

                                        <div className="alert alert-secondary border-2 mt-4">
                                            <strong>Note :</strong> La gestion des dimensions (modèles), des options compatibles et l'ajout de photos se feront dans un module séparé une fois la fiche de base sauvegardée.
                                        </div>

                                        {/* Actions */}
                                        <div className="admin-form-actions">
                                            <button
                                                type="button"
                                                className="btn-admin-cancel"
                                                onClick={() => setVueEquipement('liste')}
                                            >
                                                Annuler
                                            </button>
                                            <button type="submit" className="btn-admin-save">
                                                Enregistrer les modifications
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {ongletActif === 'categories' && (
                        <div className="admin-content-header">
                            <h1 className="admin-content-title">Catégories d'équipements</h1>
                            <p className="text-secondary fw-bold mt-2">Le module de gestion des catégories est en cours de construction.</p>
                        </div>
                    )}

                    {ongletActif === 'options' && (
                        <div className="admin-content-header">
                            <h1 className="admin-content-title">Options de machinerie</h1>
                            <p className="text-secondary fw-bold mt-2">Le module de gestion des options est en cours de construction.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        // Reste du code du terminal de login (inactif ici car condensé pour ne montrer que la modif principale)
        // Mais conserve ton return actuel du terminal de login.
        <div className="admin-terminal-wrapper">
            {/* Contenu du login actuel */}
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