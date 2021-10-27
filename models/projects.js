const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//-----------------------------------

const projectsSchema = Schema({
    title: String,
    img: String,
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Songs'
    }],
}, { timestamps: true });

module.exports = mongoose.model('Projects', projectsSchema)