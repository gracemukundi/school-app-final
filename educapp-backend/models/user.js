const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true // Convertit l'email en minuscules automatiquement
    },
    password: { 
        type: String, 
        required: true 
    },

    role: {
        type: String,
        // Liste exacte des rôles utilisés dans ton application mobile
        enum: ['super-admin', 'admin-ecole', 'professeur', 'eleve', 'parent'],
        default: 'eleve'
    },

    // --- CONNECTEUR SAAS ---
    // Liaison avec l'école (référence ton fichier school.js)
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School', 
        required: false
    },

    // --- CONNECTEUR FAMILLE ---
    // Pour les parents : liste des IDs de leurs enfants (qui sont aussi des Users)
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // --- CONNECTEUR ECOLE ---
    niveau: {
        type: String,
        enum: ['primaire', 'secondaire', 'maternelle', 'none'],
        default: 'none'
    },

    // --- SÉCURITÉ & STATUT ---
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    dateInscription: { 
        type: Date, 
        default: Date.now 
    }
});

// IMPORTANT : On exporte le modèle
// Si tu l'appelles 'User', mongoose cherchera la collection 'users' dans MongoDB
module.exports = mongoose.model('User', UserSchema);