const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Notre gardien mis à jour

// Importation des modèles
const User = require('../models/user');
const School = require('../models/school');

const JWT_SECRET = process.env.JWT_SECRET || 'grace_saas_secret_key';

/**
 * --- 1. RÉCUPÉRER TOUS LES UTILISATEURS (SÉCURISÉ 🛡️) ---
 * Faille bouchée : Seul un utilisateur avec un Token valide peut lister les membres.
 */
router.get('/', auth, async (req, res) => {
    try {
        // On exclut le mot de passe par sécurité
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Erreur GET users:", err.message);
        res.status(500).json({ msg: "Erreur serveur lors de la récupération" });
    }
});

/**
 * --- 2. INSCRIPTION ---
 * Permet de créer un compte (Élève, Enseignant, Parent ou Admin École)
 */
router.post('/register', async (req, res) => {
    try {
        const { nom, email, password, role, schoolId, niveau } = req.body;
        const cleanEmail = email?.trim().toLowerCase();

        // 1. Vérification si l'utilisateur existe déjà
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
            return res.status(400).json({ msg: "Cet email est déjà utilisé." });
        }

        // 2. Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Création de l'utilisateur
        const newUser = new User({
            nom: nom?.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: role?.trim() || 'eleve',
            schoolId: schoolId || null,
            niveau: niveau?.trim() || 'none'
        });

        await newUser.save();
        console.log(`✅ Utilisateur créé : ${cleanEmail} (${newUser.role})`);
        res.status(201).json({ msg: "✅ Utilisateur créé avec succès !", id: newUser._id });

    } catch (err) {
        console.error("❌ Erreur inscription:", err.message);
        res.status(400).json({ 
            msg: "Données invalides. Vérifiez les champs obligatoires.", 
            error: err.message 
        });
    }
});

/**
 * --- 3. CONNEXION (Génération du Badge JWT 🔑) ---
 * Synchronisé avec le middleware pour éviter l'erreur 'jwt malformed'
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // On cherche l'utilisateur
        const user = await User.findOne({ email: email?.trim().toLowerCase() });

        // Vérification email et mot de passe
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: "Email ou mot de passe incorrect." });
        }

        /**
         * IMPORTANT : Structure du Payload
         * On encapsule dans l'objet 'user' pour que middleware/auth.js 
         * puisse lire decoded.user sans erreur.
         */
        const payload = {
            user: {
                id: user._id,
                role: user.role,
                schoolId: user.schoolId
            }
        };

        // Création du Token (Valable 7 jours)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        console.log(`🔑 Connexion réussie : ${user.email} [${user.role}]`);

        res.status(200).json({
            msg: "Connexion réussie ✅",
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId
            }
        });
    } catch (err) {
        console.error("❌ Erreur Login:", err.message);
        res.status(500).json({ msg: "Erreur lors de la connexion au serveur" });
    }
});

/**
 * --- 4. SUPPRESSION UTILISATEUR (SÉCURISÉ 🛡️) ---
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        // Seul l'admin devrait pouvoir supprimer (on peut ajouter un check de rôle ici)
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ msg: "Utilisateur non trouvé" });
        
        res.status(200).json({ msg: "Utilisateur supprimé avec succès ✅" });
    } catch (err) {
        res.status(500).json({ msg: "Erreur lors de la suppression" });
    }
});

module.exports = router;