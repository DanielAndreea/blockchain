var UserModel = require('../models/user.model');

exports.getAllUsers = function (callback) {
    UserModel.find({})
        .then((list) => {
            callback(list);
        })
        .catch(error => callback(error));
};

exports.getPublicKeyByUser = function (username, callback) {
    UserModel.find({username: username})
        .then((data) => {
            callback(data, null)
        })
        .catch(err => callback(null, err))
};