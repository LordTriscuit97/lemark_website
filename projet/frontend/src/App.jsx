import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Accueil from './pages/Accueil';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Catalogue from './pages/Catalogue';
import ProduitDetail from './pages/ProduitDetail';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Accueil />} />
                        <Route path="/catalogue" element={<Catalogue />} />
                        <Route path="/categorie/:idCategorie" element={<Catalogue />} />
                        <Route path="/produit/:id" element={<ProduitDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </main>

                <footer className="bg-lemark-dark text-center py-4 mt-auto">
                    <div className="container">
                        <p className="mb-0 fw-bold">© {new Date().getFullYear()} Les Entreprises Lemark. Équipements robustes pour VTT.</p>
                        <p className="small text-secondary mt-2 mb-0">Besoin d'aide ? Appelez-nous au 1-800-555-0199</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;