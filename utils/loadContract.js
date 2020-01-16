exports.loadContract = function(abi, address, callback){
    var contract = new web3.eth.Contract(abi,address);
    callback(contract);
}