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
});


// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote/:id" login required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;
    // Create a newNote Object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){ return res.status(404).send("Not Found")}

    //will give id of the note
    if(note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});
})

module.exports = router;
