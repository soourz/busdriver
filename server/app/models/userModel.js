var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    socketID: {type: String, required: true},
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    name: {type: String, required: true},
});

module.exports = mongoose.model('User', UserSchema);

