const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

//-----------------------------------

const songsSchema = Schema({
    title: String,
    createdBy: String,
    audio: String,
    list: [{
        item: String,
        completed: {
            type: Boolean,
            default: false
        },
        sublist: Array,
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