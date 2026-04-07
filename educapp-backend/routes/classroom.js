const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroom');
const auth = require('../middleware/auth');

/**
 * --- 1. CRÉER UNE CLASSE ---
 * Réservé à l'Admin de l'école
 */
router.post('/', auth, async (req, res) => {
    try {
        const { nom, niveau, titulaire } = req.body;

        // 1. Vérification du rôle : Seul un admin peut créer
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Accès refusé. Seul l'administrateur de l'école peut ajouter des classes." });
        }

        // 2. Sécurité : On utilise le schoolId stocké dans le Token de l'admin
        // Cela garantit que la classe appartient bien à l'école de celui qui la crée
        const schoolId = req.user.schoolId;

        if (!schoolId) {
            return res.status(400).json({ msg: "Erreur : Votre compte n'est rattaché à aucune école." });
        }

        if (!nom || !niveau) {
            return res.status(400).json({ msg: "Le nom et le niveau de la classe sont requis." });
        }

        const newClass = new Classroom({
            nom,
            niveau,
            schoolId, // Injection automatique du schoolId de l'admin
            titulaire: titulaire || null
        });

        const classroom = await newClass.save();
        console.log(`🏫 Classe "${nom}" ajoutée pour l'école ID: ${schoolId}`);
        res.status(201).json(classroom);

    } catch (err) {
        console.error("❌ Erreur Create Classroom:", err.message);
        res.status(500).json({ msg: "Erreur lors de la création de la classe" });
    }
});

/**
 * --- 2. VOIR LES CLASSES DE MON ÉCOLE ---
 */
router.get('/my-school', auth, async (req, res) => {
    try {
        // On ne liste que les classes appartenant à l'école de l'utilisateur connecté
        const classrooms = await Classroom.find({ schoolId: req.user.schoolId })
            .populate('titulaire', 'nom email')
            .sort({ nom: 1 });
            
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

module.exports = router;