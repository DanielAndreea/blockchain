exports.registerDoctorInContract = function (account, password, contractAddress, contract, doc) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: contractAddress,
            from: account,
            data: contract.methods.register(doc.firstName, doc.lastName, doc.age, doc.specialization).encodeABI()
        })
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
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
