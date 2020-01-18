exports.registerPatientInContract = function (account, password, contractAddress, contract, id) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.register(id).encodeABI()
        })
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    });
};


exports.getPatientDataFromContract = function (account, password, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.owner().call(null, (err, owner) => {
            contract.methods.identifier().call(null, (err, identifier) => {
                let patient = {
                    owner: owner,
                    identifier: identifier
                };
                callback(patient);
            });
        });
    });
};