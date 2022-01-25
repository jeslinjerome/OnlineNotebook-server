const mongoose = require('mongoose');

const NotesSchema = new Schema({
    title:{
        type: String,
        requred: true
    },
    description:{
        type: String,
        requred: true
    },
    tag:{
        type: String,
        default: 'General'
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', NotesSchema);