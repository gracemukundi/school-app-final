const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Ecole = require('../models/school'); 

/**
 * @route   GET /api/stats/admin-dashboard
 * @desc    Récupérer les statistiques globales pour le Super-Admin
 * @access  Private (Super-Admin)
 */
router.get('/admin-dashboard', async (req, res) => {
    try {
        const maintenant = new Date();

        // 1. Comptage intelligent
        const [
            totalEcoles,
            totalEleves,
            totalProfs,
            totalParents,
            licencesActives,
        ] = await Promise.all([
            Ecole.countDocuments(),
            User.countDocuments({ role: 'eleve' }),
            User.countDocuments({ role: 'professeur' }),
            User.countDocuments({ role: 'parent' }),
            
            // 🔥 LA CORRECTION : Une licence est active SI le status est 'active' 
            // ET que la date de fin est dans le futur ($gt = Greater Than)
            Ecole.countDocuments({ 
                'licence.status': 'active',
                'licence.dateFin': { $gt: maintenant } 
            }),
        ]);

        // 2. Calcul des expirées (Total - Actives)
        // C'est plus précis que de chercher par texte
        const licencesExpirees = totalEcoles - licencesActives;

        // 3. Calcul du taux de santé
        let tauxRaw = 0;
        if (totalEcoles > 0) {
            tauxRaw = (licencesActives / totalEcoles) * 100;
        }
        const tauxFormatted = Math.round(tauxRaw) + '%';

        // 4. Construction de la réponse
        const responseData = {
            counts: {
                ecoles: totalEcoles || 0,
                eleves: totalEleves || 0,
                professeurs: totalProfs || 0,
                parents: totalParents || 0
            },
            licences: {
                actives: licencesActives || 0,
                expirees: licencesExpirees || 0,
                tauxActivation: tauxFormatted
            },
            status: "success",
            timestamp: maintenant
        };

        console.log(`📊 Dashboard : ${licencesActives} actives sur ${totalEcoles} écoles.`);
        
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("❌ Erreur Critique Analytics :", error);
        return res.status(500).json({ 
            msg: "Erreur lors de la génération des statistiques", 
            error: error.message,
            status: "error"
        });
    }
});

module.exports = router;