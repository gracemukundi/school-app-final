const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const auth = require('../middleware/auth');

/**
 * --- 1. INSCRIRE UN ÉLÈVE ---
 * Seul l'Admin de l'école peut inscrire
 */
router.post('/', auth, async (req, res) => {
    try {
        const { nom, postnom, prenom, genre, classId, dateNaissance } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Accès refusé. Seul l'admin inscrit les élèves." });
        }

        const newStudent = new Student({
            nom,
            postnom,
            prenom,
            genre,
            classId,
            dateNaissance,
            schoolId: req.user.schoolId // Sécurité : on prend l'ID de l'école depuis le Token
        });

        const student = await newStudent.save();
        res.status(201).json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Erreur lors de l'inscription de l'élève" });
    }
});

/**
 * --- 2. VOIR LES ÉLÈVES D'UNE CLASSE ---
 */
router.get('/class/:classId', auth, async (req, res) => {
    try {
        const students = await Student.find({ 
            classId: req.params.classId,
            schoolId: req.user.schoolId // Sécurité : ne voir que les élèves de son école
        }).sort({ nom: 1 });
        
        res.json(students);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

module.exports = router;