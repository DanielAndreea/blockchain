const mongoose = require('mongoose');

const UserModelSchema = mongoose.Schema({
    username: String,
    password: String,
    account: String,
    accountPassword: String
});

module.exports = mongoose.model("UserModel", UserModelSchema);