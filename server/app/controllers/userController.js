const user = require('../models/userModel');

exports.getUsers = async (filter) => {
    return await user.find(filter).then(users => {
        return users;
    });
};

exports.createUser = async (data) => {
    const newUser = new user(data);
    return await newUser.save()
    .then(user => {
        return(user.id);
    });
};

exports.deleteUser = async (id) => {
    await user.deleteOne({ _id: id });
};
