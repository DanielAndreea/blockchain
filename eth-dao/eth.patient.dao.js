exports.registerPatientInContract = function (account, password, contractAddress, contract, id, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.register(id).encodeABI()
        })
            .then((data) => {
                console.log('REGISTERED IN CONTRACT ', data);
                callback(data);
            })
            .catch((err) => {
                console.log(err);
                callback(err);
            });
    });
};


exports.getPatientDataFromContract = function (account, password, contract, organ, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.owner().call(null, (err, owner) => {
            contract.methods.identifier().call(null, (err, identifier) => {
                // contract.methods.doctors().call(null, (err, doctors) =>{
                contract.methods.organs(organ).call(null, (err, organs) => {
                    let patient = {
                        owner: owner,
                        identifier: identifier,
                        // doctors: doctors,
                        organ: organs
                    };
                    callback(patient);
                })
                // })

            });
        });
    });
};

//TODO: get organ contract's address by organ name!!!! => then use it
//TODO: in compute score -> load organ contract by address, call method to compute score
exports.getOrganAddressByName = function (account, password, contract, organ, callback) {
    console.log('DAO ACCOUNT: ', account)
    console.log('DAO PASSWORD: ', password)
    console.log('ORGAN: ', organ)
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.getOrganByName(organ).call(null, (err, org) => {
            if(err) console.log(err)
                console.log('RETURNED ', org)
                // return org;
                callback(org);
            }
        )
    })
}

exports.addDoctorToPatientMap = function (account, password, doctorContractAddress, status, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.addDoctorToPatientMap(doctorContractAddress, status).encodeABI(),
            gasPrice: 100
        })
            .then((data) => {
                console.log('DATA RETURNED: ', data);
                callback(data);
            })
            .catch((err) => {
                console.log(err);
                callback(data)
            });
    })
}

exports.addOrganToMap = function (account, password, organ, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.addOrganToMap(organ.toString()).encodeABI(),
            gasPrice: 100
        })
            .then((data) => {
                console.log(data);
                callback(data, null);
            })
            .catch((err) => {
                console.log(err);
                callback(null, err);
            })
    })
};

