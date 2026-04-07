const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. Middlewares de Sécurité et Parsing ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Log de chaque requête pour debugger en temps réel
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// --- 2. Configuration MongoDB ---
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ ERREUR CRITIQUE : MONGO_URI absent du fichier .env");
    process.exit(1);
}

const dbOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

mongoose.connect(mongoURI, dbOptions)
    .then(() => console.log("✅ Connexion MongoDB Atlas réussie !"))
    .catch(err => {
        console.error("❌ Erreur fatale MongoDB :", err.message);
    });

// --- 3. Routes API ---
app.use('/api/auth', require('./routes/auth'));

// Routes Écoles
const schoolRoutes = require('./routes/school');
app.use('/api/school', schoolRoutes);
app.use('/api/schools', schoolRoutes); 

// Espace Classes / Enseignants
app.use('/api/classroom', require('./routes/classroom'));

// 🔥 NOUVELLE ROUTE : Gestion des Élèves
app.use('/api/student', require('./routes/student'));

app.use('/api/stats', require('./routes/stats'));

// --- 4. Route de Diagnostic ---
app.get('/', (req, res) => {
    const states = ["Déconnecté", "Connecté", "En connexion", "En déconnexion"];
    res.json({
        projet: "EducApp DRC API",
        statut: "🚀 Serveur Opérationnel",
        database: states[mongoose.connection.readyState],
        ip_locale: process.env.IP_LOCALE || "10.99.18.126",
        port: process.env.PORT || 5000,
        timestamp: new Date().toISOString()
    });
});

// --- 5. Gestion des erreurs 404 ---
app.use((req, res, next) => {
    console.warn(`⚠️ 404 - Introuvable : ${req.method} ${req.url}`);
    res.status(404).json({ 
        msg: "Route inexistante. Vérifiez l'URL ou la méthode (GET/POST).",
        path: req.url 
    });
});

// --- 6. Gestion des erreurs Globales ---
app.use((err, req, res, next) => {
    console.error("🔥 Erreur Interne :", err.stack);
    res.status(500).json({ msg: "Erreur serveur interne", error: err.message });
});

// --- 7. Lancement du serveur ---
const PORT = process.env.PORT || 5000; 
const HOST = '0.0.0.0'; 
const IP_AFFICHEE = process.env.IP_LOCALE || "10.99.18.126";

app.listen(PORT, HOST, () => {
    console.log(`
    ---------------------------------------------------
    🚀 SERVEUR EDUCAPP DRC DÉMARRÉ
    📡 ADRESSE : http://${IP_AFFICHEE}:${PORT}
    🔧 DB STATUS : Opérationnel
    📂 ROUTES DISPONIBLES :
       - Auth      : /api/auth
       - Écoles    : /api/schools
       - Classes   : /api/classroom
       - Stats     : /api/stats
    ---------------------------------------------------
    `);
});