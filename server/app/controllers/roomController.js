var mongoose = require('mongoose');
var room = require('../models/roomModel')

exports.getRoom = (id) => {
    room.findById(id, (err, note) => {
        if (err) {
        }
        return note;
    });
};

// getAllRooms = (req, res) => {
//     note.find({}, (err, notes) => {
//         if (err) {
//             res.send(err);
//         }

//         res.json(notes);
//     });
// };

exports.createRoom = (data, callback) => {
    const newRoom = new room(data);
    newRoom.save()
    .then(room => {
        callback(room.id)
    }); //implement catch
};

// updateRoom = (req, res) => {
//     note.findOneAndUpdate({
//         _id: req.params.noteId
//      }, req.body,
//         (err, note) => {
//             if (err) {
//                 res.send(err);
//             }

//             res.json(note);
//         });
// };

// deleteRoom = (req, res) => {
//     note.remove({
//         _id: req.params.noteId
//     }, (err) => {
//         if (err) {
//             res.send(err);
//         }

//         res.json({
//             message: `note ${req.params.noteId} successfully deleted`
//         });
//     });
// };