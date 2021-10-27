const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//-----------------------------------

const projectSchema = Schema({
    title: String,
    img: String,
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema)