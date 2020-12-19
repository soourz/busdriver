var mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    code: {type: String, required: true},
    users: {type: Schema.Types.ObjectId, ref: 'User'},
 //   game: {type: Schema.Types.ObjectId, ref: 'Game'},
 //   roomMode: {type: String, enum: ['lobby', 'inGame', ]}
});

module.exports = mongoose.model('Room', RoomSchema);

