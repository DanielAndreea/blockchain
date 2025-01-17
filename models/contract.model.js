const mongoose = require('mongoose');

const ContractModelSchema = mongoose.Schema({
    contractName: String,
    contractAddress: String,
    contractOwner: String
});

module.exports = mongoose.model("ContractModel", ContractModelSchema);