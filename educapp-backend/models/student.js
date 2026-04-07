const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    postnom: { type: String, trim: true },
    prenom: { type: String, required: true, trim: true },
    genre: { 
        type: String, 
        enum: ['M', 'F'], 
        required: true 
    },
    dateNaissance: { type: Date },
    // Liaison avec l'école (Indispensable pour filtrer)
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school',
        required: true
    },
    // Liaison avec la classe (Ex: 6ème A)
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classroom',
        required: true
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('student', StudentSchema);