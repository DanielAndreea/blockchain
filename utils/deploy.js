exports.deploy = function (abi, bin, account, password, callback) {
    web3.eth.personal.unlockAccount(account, password, null, (err) => {
        if (err) {
            console.log('Account cannot be unlocked ', err);
        } else {
            console.log("Account unlocked!");
        }
        const contract = new web3.eth.Contract(abi);
        contract.deploy({
            data: bin
        })
            .send({
                from: account,
                gas: 1000000,
                gasPrice: 100 //OBLIGATORIU
            })
            .on("receipt", (receipt) => {
                console.log(receipt);
            })
            .then((instance) => {
                console.log("CONTRACT DEPLOYED AT ADDRESS: ", instance.options.address);
                // callback(instance.options.address)
                // let contractToInsert = new ContractModel({
                //     contractName: contractPatientType,
                //     contractAddress: instance.options.address,
                //     contractOwner: patient[0].account
                // })
                // patientDao.saveContract(contractToInsert);
                // console.log(instance);
                callback(instance.options.address);
                // return instance.options.address;
            })
            .catch(console.log);
    })
}