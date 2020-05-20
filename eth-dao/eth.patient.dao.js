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


exports.getPatientDataFromContract = function (account, password, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.owner().call(null, (err, owner) => {
            contract.methods.identifier().call(null, (err, identifier) => {
                contract.methods.donor().call(null, (err, donor) => {
                    contract.methods.receiver().call(null, (err, receiver) => {
                        contract.methods.getTrustedPerson().call(null, (err, trustedPerson) => {
                            let patient = {
                                owner: owner,
                                identifier: identifier,
                                donor: donor,
                                receiver: receiver,
                                trustedPerson: trustedPerson
                            };
                            callback(patient);
                        })
                    })
                })
            });
        });
    });
};

exports.getOrganAddressByName = function (account, password, contract, organ, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.getOrganByName(organ).call(null, (err, org) => {
                if (err) console.log(err);
                callback(org);
            }
        )
    })
};

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
                callback(data);
            })
            .catch((err) => {
                callback(data)
            });
    })
};

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
                callback(data, null);
            })
            .catch((err) => {
                callback(null, err);
            })
    })
};

exports.addFileHash = function (account, password, hash, name, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        console.log(contract.methods)
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.addNewDocument(hash.toString(), name).encodeABI(),
            gasPrice: 5000
        })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                callback(err);
            })
    })
};

exports.getDocuments = function (account, password, contract, callback) {
    var documents = [];
    var myMap = [];
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.numberOfIpfs().call(null, async (err, number) => {
            if (err) console.log(err);
            for (let i = 0; i < number; i++) {
                let document = await getDoc(contract, i);
                let fileName = await getMapping(contract, document);
                documents.push(document);
                myMap.push({hash: document, name: fileName});
            }
            callback(myMap);
        })
    })
};


exports.markPatientAsDonor = function (account, password, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.markPatientAsDonor().encodeABI(),
            gasPrice: 5000
        })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                callback(err);
            })
    })
};

exports.markPatientAsReceiver = function (account, password, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.markPatientAsReceiver().encodeABI(),
            gasPrice: 5000
        })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                callback(err);
            })
    })
};

function getDoc(contract, number) {
    return new Promise(resolve => contract.methods.ipfs(number).call(null, (err, doc) => {
        resolve(doc);
    }))
}

function getMapping(contract, hash) {
    return new Promise(resolve => contract.methods.documents(hash).call(null, (err, doc) => {
        resolve(doc);
    }))
}

exports.createRequest = function (account, password, contractAddress, contract, docContractAddress, fileHash,fileName, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        web3.eth.getGasPrice()
            .then((result) => {
                var mapKey = docContractAddress + fileHash;
                web3.eth.sendTransaction({
                    to: contractAddress,
                    from: account,
                    data: contract.methods.createRequest(mapKey, new Date(),fileHash, fileName).encodeABI(),
                    gasPrice: web3.utils.fromWei(result, 'ether')
                })
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback(err);
                    })
            })
    })
};

exports.approveRequest = function (account, password, contractAddress, contract, docContractAddress, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        web3.eth.getGasPrice()
            .then((result) => {
                var mapKey = docContractAddress + fileHash;
                web3.eth.sendTransaction({
                    to: contractAddress,
                    from: account,
                    data: contract.methods.approveRequest(mapKey, new Date(), contractAddress).encodeABI(),
                    gasPrice: web3.utils.fromWei(result, 'ether')
                })
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback(err);
                    })
            })
    })
};

exports.setTrustedPerson = function (account, password, contract, contractAddress, personAddress, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        web3.eth.getGasPrice()
            .then((result) => {
                web3.eth.sendTransaction({
                    to: contractAddress,
                    from: account,
                    data: contract.methods.setTrustedPerson(personAddress).encodeABI(),
                    gasPrice: web3.utils.fromWei(result, 'ether')
                })
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback(err);
                    })
            })
    })
};


exports.getRequests = function (account, password, contract, callback) {
    var requests = [];
    var myMap = [];
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.numberOfRequests().call(null, async (err, number) => {
            if (err) console.log(err);
            for (let i = 0; i < number; i++) {
                let req = await getRequestFromArray(contract, i);
                let obj = await getRequestsFromMapping(contract, req);
                requests.push(req);
                myMap.push({mapKey: req, request: obj});
            }
            callback(myMap);
        })
    })
};

function getRequestFromArray(contract, number) {
    return new Promise(resolve => contract.methods.requestsArray(number).call(null, (err, doc) => {
        resolve(doc);
    }))
}

function getRequestsFromMapping(contract, mapKey) {
    return new Promise(resolve => contract.methods.requests(mapKey).call(null, (err, doc) => {
        resolve(doc);
    }))
}