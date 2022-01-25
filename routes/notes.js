const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the Notes using: GET "/api/notes/fetchallnotes" login required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({user: req.user.id}) //get all the notes
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});


// ROUTE 2: Add a new Note using: POST "/api/notes/addnote" login required.
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3}),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5})
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // If there are errors, rturn Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        // if there are no errors then put all the things of the notes
        const note = new Notes({
        title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote) 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

    
})

module.exports = router;
