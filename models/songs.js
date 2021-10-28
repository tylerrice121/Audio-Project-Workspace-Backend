const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songsSchema = Schema({
    song: {
        title: String,
        audio: String,
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Projects'  
        },
        list: [{
           item: String,
           sublist: Array,
        }]
    }
});

module.exports = mongoose.model('Songs', songsSchema);