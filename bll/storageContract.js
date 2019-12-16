const Tx = require('ethereumjs-tx').Transaction;
var fs = require('fs');
var path = require('path');

var abiJson = './contracts/compiled/Counter_sol_Counter.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJson)));


var binJson = './contracts/compiled/Counter_sol_Counter.bin';
var parsedBIN = fs.readFileSync(path.resolve(binJson));


console.log('ABI: ', parsedABI);
console.log('BIN: ', parsedBIN);

var contractAddress = '';

exports.deployStorageContract = function(req,res){

    //first account from list
    var account1 = '0x04Fb94F5E2555d1E860462060337Aa62ec6e919d';
    //password: user-acc
    var pass1 = 'user-acc';

    web3.eth.personal.unlockAccount(account1, pass1, null, (err) => {
        if (err) {
            console.log('first account locked', err);
        } else console.log('first account unlocked');

        const storageContract = new web3.eth.Contract(parsedABI);
        storageContract.deploy({
            data: '0x'+parsedBIN
        })
            .send({from: account1, gas: 1000000})
            .then((instance) => {
                console.log("ADDRESS: " , instance.options.address);
                contractAddress = instance.options.address;
            })
            .catch(console.log);
    });
}

exports.setStorageContract = function(req,res){
    console.log('CONTRACT ADDRESS: ', req.body.contractAddress);
    var contract = new web3.eth.Contract(parsedABI, req.body.contractAddress);
    console.log(contract);
    var account1 = '0x04Fb94F5E2555d1E860462060337Aa62ec6e919d';
    var pass1 = 'user-acc';
    web3.eth.personal.unlockAccount(account1, pass1, null, (err) => {
        web3.eth.sendTransaction({
            to: req.body.contractAddress,
            from: account1,
            data: contract.methods.increment().encodeABI()
        })
    })
}

exports.getStorageContract = function(req,res){
    console.log('CONTRACT ADDRESS: ', req.body.contractAddress);
    var contract = new web3.eth.Contract(parsedABI, req.body.contractAddress);
    console.log(contract);
    contract.methods.getCount().call(console.log);
}