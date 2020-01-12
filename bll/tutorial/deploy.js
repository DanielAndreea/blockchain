const Tx = require('ethereumjs-tx').Transaction;

exports.deployContract = function (req, res) {

    //ganache accounts
    const account1 = '0xf49ad8b5B0218d457f7763E212Cc2904E8965d92';
    const privateKey1 = Buffer.from('b1587f1f66162117e62463d4f96ed1439e2dce9ab032260fb00eed328c0396f9', 'hex');

    const contractABI = [{"constant":true,"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    const contractAddress = '0xaa3E79169856043040cB8219a5dDD6dEEf7b2237';
    var simplestorageContract = new web3.eth.Contract(contractABI,contractAddress);

    console.log(simplestorageContract.methods);
    simplestorageContract.methods.get().call((err,result)=>{console.log(result);  res.send(result)});

    // USED TO CREATE THE CONTRACT; used only once
    web3.eth.getTransactionCount(account1, (err, txCount) => {
        console.log(txCount);

        //SMART CONTRACT DATA
        const data = '0x608060405234801561001057600080fd5b5060c68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea265627a7a72315820c916c59acacbe44a19795dcef7bc4f67fef3451e52ca6ac56b042e57b640bf1d64736f6c634300050c0032';

        //BUILD THE TRANSACTION
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: data
        }

        console.log(txObject);
        //SIGN THE TRANSACTION
        //sign the transaction using the private key
        const tx = new Tx(txObject);
        tx.sign(privateKey1);

        //serialize it and convert it to a hex string to pass it to sendSignedTransaction
        const serializedTransaction = tx.serialize();
        const raw = '0x' + serializedTransaction.toString('hex');

        console.log(tx);
        console.log(raw);
        //BROADCAST THE TRANSACTION
        web3.eth.sendSignedTransaction(raw, (err, txHash) => {
            console.log(raw.toString());
            console.log(err);
            console.log('txHash: ', txHash);
            res.send(txHash);
        })
    })
}