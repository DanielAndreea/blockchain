var UserModel = require('../models/user.model');

exports.getAllUsers = function (callback) {
    UserModel.find({})
        .then((list) => {
            callback(list);
        })
        .catch(console.log);
}