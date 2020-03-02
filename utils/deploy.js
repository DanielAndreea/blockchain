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
                gas: 5000000,
                gasPrice: 100 //OBLIGATORIU
            })
            .on("receipt", (receipt) => {
                console.log(receipt);
            })
            .then((instance) => {
                console.log("CONTRACT DEPLOYED AT ADDRESS: ", instance.options.address);
                callback(instance.options.address);
            })
            .catch(console.log);
    })
}