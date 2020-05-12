const mongoose = require('mongoose');

const RequestsModelSchema = mongoose.Schema({
    doctor: String,
    patient: String,
    hash: String,
    name: String,
    status: String,
    date: Date
});

module.exports = mongoose.model("RequestsModel", RequestsModelSchema);