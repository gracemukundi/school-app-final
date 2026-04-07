const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true, // Ex: "6ème Primaire A"
        trim: true
    },
    niveau: {
        type: String,
        required: true // Ex: "Primaire", "Secondaire", "Humanité"
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school', // Liaison avec le modèle School
        required: true
    },
    titulaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Liaison avec l'enseignant (User)
        default: null
    },
    nbEleves: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('classroom', ClassroomSchema);