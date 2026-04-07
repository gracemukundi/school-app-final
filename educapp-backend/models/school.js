const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    adresse: { type: String, trim: true },
    ville: { type: String, trim: true },

    // Code d'invitation unique pour l'inscription
    inviteCode: { type: String, required: true, unique: true, trim: true },

    // Nom du directeur ou responsable
    directeur: { type: String, trim: true },

    // Numéro de téléphone de l'école
    telephone: { type: String, trim: true },

    // Type d'établissement
    type: {
        type: String,
        enum: ['complexe', 'primaire', 'secondaire', 'maternelle'],
        default: 'complexe'
    },

    // --- 🛡️ SECTION LICENCE (AJOUTÉE) ---
    licence: {
        status: { 
            type: String, 
            enum: ['active', 'expired', 'suspendue'], 
            default: 'expired' 
        },
        dateDebut: { type: Date, default: Date.now },
        dateFin: { type: Date, default: Date.now }, // C'est ici que stats.js va regarder
        type: { type: String, default: 'Mensuel' }
    },

    // Date de création dans la base
    dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('School', SchoolSchema);