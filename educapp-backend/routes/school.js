const express = require('express');
const router = express.Router();
const School = require('../models/school');
const auth = require('../middleware/auth'); 

/**
 * --- 1. VOIR TOUTES LES ÉCOLES ---
 * MODE TEST : 'auth' est retiré pour laisser passer ton téléphone 🔓
 */
router.get('/', async (req, res) => {
    try {
        const schools = await School.find().sort({ createdAt: -1 });
        res.json(schools);
    } catch (err) {
        console.error("❌ Erreur Get All Schools:", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
});

/**
 * --- 2. VOIR UNE ÉCOLE PRÉCISE ---
 * MODE TEST : 'auth' est retiré pour tester les détails 🔓
 */
router.get('/:id', async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ msg: "École non trouvée" });
        res.json(school);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: "Format ID invalide" });
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/**
 * --- 3. CRÉER UNE ÉCOLE ---
 * ON GARDE 'auth' ICI 🛡️ (Sécurité minimale pour ne pas polluer ta base)
 */
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Accès refusé." });
        }
        const { nom, inviteCode } = req.body;
        const newSchool = new School({ 
            ...req.body, 
            inviteCode: inviteCode.toUpperCase().trim() 
        });
        await newSchool.save();
        res.status(201).json(newSchool);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * --- 4. GESTION DE LICENCE ---
 * ON GARDE 'auth' ICI 🛡️
 */
router.patch('/:id/licence', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Interdit" });
        
        const { id } = req.params;
        const { status, joursAjoutes } = req.body;
        const school = await School.findById(id);

        let baseDate = (school.licence && school.licence.dateFin) ? new Date(school.licence.dateFin) : new Date();
        if (baseDate < new Date()) baseDate = new Date();
        if (joursAjoutes) baseDate.setDate(baseDate.getDate() + parseInt(joursAjoutes));

        const updatedSchool = await School.findByIdAndUpdate(
            id,
            { $set: { "licence.status": status || 'active', "licence.dateFin": baseDate } },
            { new: true }
        );
        res.json({ msg: "Licence OK ✅", school: updatedSchool });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;