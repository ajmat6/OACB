const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    notesImage: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },

    parentId: {
        type: String,
    },

    notesLink: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Note', NotesSchema)