const mongoose = require('mongoose');

const UserModelSchema = mongoose.Schema({
    username: String,
    password: String,
    role: String,
    account: String,
    accountPassword: String,
    publicKey: String
});

module.exports = mongoose.model("UserModel", UserModelSchema);