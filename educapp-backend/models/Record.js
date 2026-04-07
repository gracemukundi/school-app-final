const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ecole: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  
  // Section NOTES
  notes: [{
    matiere: String,
    valeur: Number,
    max: { type: Number, default: 20 },
    periode: String, // ex: "1ère Période"
    date: { type: Date, default: Date.now }
  }],

  // Section PRÉSENCE
  presences: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Présent', 'Absent', 'Retard'], default: 'Présent' },
    justifie: { type: Boolean, default: false }
  }],

  // Section CONDUITE & RÉCOMPENSE
  conduite: [{
    typeAction: { type: String, enum: ['Récompense', 'Sanction', 'Observation'] },
    commentaire: String,
    pointsImpact: Number, // ex: -5 pour une sanction
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Record', RecordSchema);