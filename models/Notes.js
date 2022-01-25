const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  //which user like to this model like forgin key
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' // now we can store user
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notes = mongoose.model("notes", NotesSchema);
module.exports = Notes;
