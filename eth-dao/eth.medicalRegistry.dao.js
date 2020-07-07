exports.markPatientAsDonorInRegistry = function (account, password, patientContractAddress, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
            if (err) callback(err);
            web3.eth.sendTransaction({
                to: contractAddress,
                from: account,
                data: contract.methods.markPatientAsDonor(patientContractAddress, new Date().toString()).encodeABI()
            })
                .then((data) => {
                    callback(data);
                })
                .catch((err) => {
                    callback(err);
                })
        }
    )
};

exports.markPatientAsReceiverInRegistry = function (account, password, patientContractAddress, doctorContractAddress, score, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
            if (err) callback(err);
            web3.eth.sendTransaction({
                to: contractAddress,
                from: account,
                data: contract.methods.markPatientAsReceiver(patientContractAddress, new Date().toString(), doctorContractAddress, score).encodeABI()
            })
                .then((data) => {
                    callback(data);
                })
                .catch((err) => {
                    callback(err);
                })
        }
    )
};

exports.addDoctorToRegistry = function (account, password, doctorAccount, doctorContract, contractAddress, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
            if (err) callback(err);
            web3.eth.sendTransaction({
                to: contractAddress,
                from: account,
                data: contract.methods.addDoctorToDoctorsMap(doctorContract, doctorAccount).encodeABI()
            })
                .then((data) => {
                    callback(data);
                })
                .catch((err) => {
                    callback(err);
                })
        }
    )
};

exports.getReceiversDetails = function (account, password, contract, list, callback) {
    var details = [];
    web3.eth.personal.unlockAccount(account, password, null, async (err) => {
        if (err) return callback(err);
        for (let i = 0; i < list.length; i++) {
            let info = await getReceiverDetails(contract, list[i]);
            let obj = {
                info: info,
                patient: list[i]
            };
            details.push(obj);
        }
        callback(details);
    })

};

function getReceiverDetails(contract, address) {
    return new Promise(resolve => contract.methods.receivers(address).call(null, (err, info) => {
        resolve(info);
    }))
}

exports.getReceivers = function (account, password, contract, callback) {
    var receivers = [];
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        contract.methods.numberOfReceivers().call(null, async (err, number) => {
            if (err) callback(err);
            for (let i = 0; i < number; i++) {
                let receiver = await getContractReceiversArray(contract, i);
                receivers.push(receiver);
            }
            callback(receivers);
        })
    })
};

function getContractReceiversArray(contract, number) {
    return new Promise(resolve => contract.methods.receiversContractAddresses(number).call(null, (err, contractAddress) => {
        resolve(contractAddress);
    }))
}

exports.getDonorsDetails = function (account, password, contract, list, callback) {
    var details = [];
    web3.eth.personal.unlockAccount(account, password, null, async (err) => {
        if (err) return callback(err);
        for (let i = 0; i < list.length; i++) {
            let info = await getDonorDetails(contract, list[i]);
            let obj = {
                info: info,
                patient: list[i]
            };
            details.push(obj);
        }
        callback(details);
    })
};

function getDonorDetails(contract, address) {
    return new Promise(resolve => contract.methods.donors(address).call(null, (err, info) => {
        resolve(info);
    }))
}

exports.getDonors = function (account, password, contract, callback) {
    var donors = [];
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) callback(err);
        contract.methods.numberOfDonors().call(null, async (err, number) => {
            if (err) callback(err);
            for (let i = 0; i < number; i++) {
                let donor = await getContractDonorsArray(contract, i);
                donors.push(donor);
            }
            callback(donors);
        })
    })
};

function getContractDonorsArray(contract, number) {
    return new Promise(resolve => contract.methods.donorsContractAddresses(number).call(null, (err, contractAddress) => {
        resolve(contractAddress);
    }))
}

exports.getFinalListReceivers = function (account, password, patientAbi, doctorAbi, list, callback) {
    var receivers = [];
    web3.eth.personal.unlockAccount(account, password, null, async (err) => {
        if (err) callback(err);
        for (let i = 0; i < list.length; i++) {
            var patientContract = new web3.eth.Contract(patientAbi, list[i].patient);
            var doctorContract = new web3.eth.Contract(doctorAbi, list[i].info.doctorContract);
            let obj = await getFinalReceivers(patientContract, doctorContract);
            let final = {
                personsDetails: obj,
                info: list[i]
            };
            receivers.push(final);
        }
        callback(receivers);
    });
};

function getFinalReceivers(patientContract, doctorContract) {
    return new Promise(resolve => doctorContract.methods.owner().call(null, (err, owner) => {
        doctorContract.methods.firstName().call(null, (err, firstName) => {
            doctorContract.methods.lastName().call(null, (err, lastName) => {
                doctorContract.methods.age().call(null, (err, age) => {
                    doctorContract.methods.specialization().call(null, (err, specialization) => {
                        patientContract.methods.owner().call(null, (err, owner) => {
                            patientContract.methods.identifier().call(null, (err, identifier) => {
                                patientContract.methods.donor().call(null, (err, donor) => {
                                    let patient = {
                                        owner: owner,
                                        identifier: identifier,
                                        donor: donor
                                    };
                                    let doctor = {
                                        owner: owner,
                                        firstName: firstName,
                                        lastName: lastName,
                                        age: age,
                                        specialization: specialization
                                    };
                                    let obj = {
                                        patient: patient,
                                        doctor: doctor
                                    };
                                    resolve(obj);
                                })
                            });
                        });
                    });
                });
            });
        });
    }))
}