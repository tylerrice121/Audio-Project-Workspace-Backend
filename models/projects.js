const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//-----------------------------------

const songsSchema = Schema({
    title: String,
    createdBy: String,
    audio: String,
    list: [{
        item: String,
        uniqueId: Number,
        completed: {
            type: Boolean,
            default: false
        },
    }]
});

const projectsSchema = Schema({
    title: String,
    img: String,
    songs: [songsSchema],
    managedBy: String
}, { timestamps: true });

module.exports = mongoose.model('Songs', songsSchema)
module.exports = mongoose.model('Projects', projectsSchema)