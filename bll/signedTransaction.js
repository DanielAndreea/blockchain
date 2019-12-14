const Tx = require('ethereumjs-tx').Transaction;

exports.signedTx = function (req, res) {

    //ganache accounts
    const account1 = '0xf49ad8b5B0218d457f7763E212Cc2904E8965d92';
    const account2 = '0xFC707311C55b0C3F04B6b461D6849ABC7A235b80';

    const privateKey1 = Buffer.from('b1587f1f66162117e62463d4f96ed1439e2dce9ab032260fb00eed328c0396f9', 'hex');
    const privateKey2 = 'ac54a64ca514a6104d5209834441616d04a1a07952c2eb6e36d6593bb10ac684';

    web3.eth.getTransactionCount(account1, (err, txCount) => {
        console.log(txCount);
        //BUILD THE TRANSACTION
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: account2,
            value: web3.utils.toHex(web3.utils.toWei('1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
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