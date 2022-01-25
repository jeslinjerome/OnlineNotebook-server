const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        requred: true
    },
    email:{
        type: String,
        requred: true,
        unique: true
    },
    password:{
        type: String,
        requred: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);