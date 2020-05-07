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

exports.markPatientAsReceiverInRegistry = function (account, password, patientContractAddress,doctorContractAddress, score, contractAddress, contract, callback) {
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

exports.addDoctorToRegistry = function(account, password, doctorAccount, doctorContract, contractAddress, contract, callback){
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

exports.getReceiversDetails = function(){

}

exports.getDonorsDetails = function(){

}
exports.getReceivers = function(account, password, contract, callback){
    var receivers = [];
    web3.eth.personal.unlockAccount(account,password, null, (err)=>{
        if(err) callback(err);
        contract.methods.numberOfReceivers().call(null, async(err, number)=>{
            if(err) callback(err);
            for(let i = 0; i < number; i++){
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

exports.getDonors = function(account, password, contract, callback){
    var donors = [];
    web3.eth.personal.unlockAccount(account,password, null, (err)=>{
        if(err) callback(err);
        contract.methods.numberOfDonors().call(null, async(err, number)=>{
            if(err) callback(err);
            for(let i = 0; i < number; i++){
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