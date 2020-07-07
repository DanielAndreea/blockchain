exports.generateNewAccount = function (user, callback) {
    web3.eth.personal.newAccount(user, (error,account) =>{
        if(error) console.log(error)
        callback(account)
    })
};


exports.registerDoctorInContract = function (account, password, contractAddress, contract, doc, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.register(doc.firstName, doc.lastName, doc.age, doc.specialization).encodeABI()
        })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                callback(err);
            });

    });
};

exports.getDoctorDataFromContract = function (account, password, contract, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.owner().call(null, (err, owner) => {
            contract.methods.firstName().call(null, (err, firstName) => {
                contract.methods.age().call(null, (err, age) => {
                    contract.methods.specialization().call(null, (err, specialization) => {
                        let doctor = {
                            owner: owner,
                            firstName: firstName,
                            age: age,
                            specialization: specialization
                        };
                        callback(doctor);
                    });
                });
            });
        });
    });
};

exports.consultPatient = function (account,
                                   password,
                                   contractAddress,
                                   contract,
                                   patientAccountAddress,
                                   patientContractAddress, ssn, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.consultPatient(patientAccountAddress, patientContractAddress).encodeABI()
        })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                callback(err);
            });
    })
};


exports.getConsultedPatient = function (account, password, contract, contractAddress, patientAccountAddress, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.getConsultedPatient(patientAccountAddress).call(
            {
                from: account
            }, (err, contractAddress) => {
                if (err) console.log(err)
                callback(contractAddress);
            }
        )
    })
};


exports.getAllConsultedPatients = function (account, password, contract, callback) {
    var patientsContractAddresses = [];
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        contract.methods.numberOfPatients().call(null, async (err, number) => {
                if (err) console.log(err);
                for (let i = 0; i < number; i++) {
                    let patient = await getContractPatientsArray(contract, i);
                    patientsContractAddresses.push(patient);
                }
                callback(patientsContractAddresses)
            }
        )
    })
};

function getContractPatientsArray(contract, number) {
    return new Promise(resolve => contract.methods.patientsArray(number).call(null, (err, contractAddress) => {
        resolve(contractAddress);
    }))
}
