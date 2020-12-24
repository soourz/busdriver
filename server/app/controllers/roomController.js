const room = require('../models/roomModel');

exports.getRooms = async (filter) => {
    return await room.find(filter).populate('users') //populate replaces user ids with the actual user objects... help: https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0
    .then(rooms => {
        return rooms;
    })
    .catch(err => {
        console.log(err);
        return -1;
    });
};

exports.createRoom = async (data) => {
    const newRoom = new room(data);
    return await newRoom.save()
    .then(room => {
        return room.id;
    })
    .catch(err => {
        console.log(err);
        return -1;
    });
};

exports.updateRoom = async (id, data) => {
    await room.findOneAndUpdate( {_id: id }, data, { new: true, useFindAndModify: false });
};

exports.deleteRoom = async (id) => {
     await room.deleteOne({ _id: id });
};

exports.deleteAllRooms = async () => {
    await room.deleteMany({});
};
