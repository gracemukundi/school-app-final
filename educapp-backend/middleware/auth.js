const jwt = require('jsonwebtoken');

// Clé secrète : Priorité au .env pour la production
const JWT_SECRET = process.env.JWT_SECRET || 'grace_saas_secret_key';

/**
 * Middleware d'authentification EducApp DRC
 * Protège les routes et injecte l'utilisateur dans la requête
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Vérifie si le header existe et commence par "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn(`[AUTH] Tentative d'accès refusée : Header manquant ou mal formé.`);
            return res.status(401).json({ 
                msg: "⛔ Accès refusé. Authentification requise." 
            });
        }

        // 2. Extraction du token (on ignore le mot "Bearer")
        const token = authHeader.split(' ')[1];

        // 3. Vérification et décodage du jeton
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Injection sécurisée dans req.user
        // On cherche d'abord dans decoded.user (nouveau format) sinon à la racine (ancien format)
        const userData = decoded.user || decoded;

        req.user = {
            id: userData.id || userData._id,
            role: userData.role,
            // Sécurité : évite le crash si schoolId est manquant
            schoolId: userData.schoolId || null 
        };

        // Optionnel : Log de debug pour voir qui appelle l'API dans ton terminal
        // console.log(`📡 [AUTH] Utilisateur ${req.user.id} (${req.user.role}) connecté.`);

        next(); // On autorise le passage à la route suivante

    } catch (err) {
        console.error("❌ Erreur authMiddleware:", err.message);

        // Cas spécifique : Token expiré
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                msg: "⛔ Votre session a expiré. Veuillez vous reconnecter." 
            });
        }

        // Autres cas : Token corrompu (jwt malformed) ou mauvaise clé
        res.status(401).json({ 
            msg: "⛔ Session invalide. Accès non autorisé." 
        });
    }
};

// Exportation pour utilisation dans routes/
module.exports = authMiddleware;