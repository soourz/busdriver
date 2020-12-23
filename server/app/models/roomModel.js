const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    code: {type: String, required: true},
    roomMode: {type: String, required: true, enum: ['waiting', 'playing']},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
 //   game: {type: Schema.Types.ObjectId, ref: 'Game'}
});

module.exports = mongoose.model('Room', RoomSchema);

