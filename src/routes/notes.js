const express = require('express');
const { adminMiddleware, userMiddleware } = require('../middleware/userMiddleware');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware')
const slugify = require('slugify');
const shortid = require('shortid');
const Notes = require('../models/Notes');

router.post('/notes/add', fetchuser, adminMiddleware, upload.single('notesImage'), async (req, res) => {
    try
    {
        const payload = {
            title: req.body.title,
            slug: `${slugify(req.body.title)}-${shortid.generate()}`,
            notesLink: req.body.link,
        }
    
        if(req.file)
        {
            payload.notesImage = `${req.file.filename}`
        }

        if(req.body.parentId)
        {
            payload.parentId = req.body.parentId
        }
    
        // check if the topic already exist:
        const alreadyNotes = await Notes.findOne({title: req.body.title});
    
        if(alreadyNotes) return res.status(400).json({message: "Notes Already Exist"})
    
        const newNotes = await new Notes(payload);
        await newNotes.save();
    
        res.status(200).json(newNotes);
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");    
    }
})

router.get('/getnotes', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const allNotesFrontTopics = await Notes.find({parentId: null});
        if(allNotesFrontTopics) return res.status(200).json(allNotesFrontTopics);
        else return res.status(400).json({message: "No Notes Topics Found"});
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");    
    }
})

router.get('/getnotes/admin', fetchuser, adminMiddleware, async (req, res) => {
    try
    {
        const allNotesFrontTopics = await Notes.find({});
        if(allNotesFrontTopics) return res.status(200).json(allNotesFrontTopics);
        else return res.status(400).json({message: "No Notes Topics Found"});
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");    
    }
})

// get notes by parentid:
router.get('/getnotes/:parent', fetchuser, userMiddleware, async (req, res) => {
    try
    {
        const {parent} = req.params;

        const allNotesByParent = await Notes.find({parentId: parent});
        if(allNotesByParent) return res.status(200).json(allNotesByParent);
        else return res.status(400).json({message: "No Notes Found For This Topic. Please Do share If you Have!"})
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send("Some Internal Server Error Occured! Please try again after some times");    
    }
})

// update the notes information:

module.exports = router;