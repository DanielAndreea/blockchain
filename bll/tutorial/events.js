const Tx = require('ethereumjs-tx').Transaction;

exports.events = function (req, res) {

    //ganache accounts
    const account1 = '0xf49ad8b5B0218d457f7763E212Cc2904E8965d92';
    const account2 = '0xFC707311C55b0C3F04B6b461D6849ABC7A235b80';

    const privateKey1 = Buffer.from('b1587f1f66162117e62463d4f96ed1439e2dce9ab032260fb00eed328c0396f9', 'hex');
    const privateKey2 = 'ac54a64ca514a6104d5209834441616d04a1a07952c2eb6e36d6593bb10ac684';

    const contractABI = [{"constant":true,"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    const contractAddress = '0xaa3E79169856043040cB8219a5dDD6dEEf7b2237';
    var simplestorageContract = new web3.eth.Contract(contractABI,contractAddress);

    console.log(simplestorageContract);
    simplestorageContract.methods.get().call((err,result)=>{console.log(result);  res.send(result)});

    simplestorageContract.getPastEvents('allEvents',
        {
            fromBlock: 0 ,
            toBlock: 'latest'
        },
        (err,events) => {console.log(events.length)})
    // //USED TO CREATE THE CONTRACT; used only once
    // web3.eth.getTransactionCount(account1, (err, txCount) => {
    //     console.log(txCount);
    //
    //     const contractAddress = '0xDCb010Ac1139Fa73fDb6470cB3C67dF710D6b8B8';
    //     const contractABI = [{"constant":true,"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    //
    //     const storageContract = new web3.eth.Contract(contractABI,contractAddress);
    //
    //     //BUILD THE TRANSACTION
    //     const txObject = {
    //         nonce: web3.utils.toHex(txCount),
    //         gasLimit: web3.utils.toHex(800000),
    //         gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    //         //to: CREATE A SMART CONTRACT (use '/deployContract') AND COPY ADDRESS
    //         to: contractAddress,
    //         //data: hexa encoded representation of the actual function name of the smart
    //         //contract that we are trying to call
    //         data: storageContract.methods.set(10).encodeABI()
    //     }
    //
    //     console.log(txObject);
    //     //SIGN THE TRANSACTION
    //     //sign the transaction using the private key
    //     const tx = new Tx(txObject);
    //     tx.sign(privateKey1);
    //
    //     //serialize it and convert it to a hex string to pass it to sendSignedTransaction
    //     const serializedTransaction = tx.serialize();
    //     const raw = '0x' + serializedTransaction.toString('hex');
    //
    //     console.log(tx);
    //     console.log(raw);
    //     //BROADCAST THE TRANSACTION
    //     web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    //         console.log(raw.toString());
    //         console.log(err);
    //         console.log('txHash: ', txHash);
    //         res.send(txHash);
    //
    //         // console.log(storageContract.methods.get.call((err,result)=>{console.log(err, result); res.send(result)}))
    //     })
    //
    // })


}