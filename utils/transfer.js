exports.transferMoneyToNewAccount = function(senderAccount,senderPassword, receiverAccount, callback){
    web3.eth.personal.unlockAccount(senderAccount, senderPassword, null, (err) => {
        if (err) console.log(err);
        web3.eth.sendTransaction({
            to: receiverAccount,
            from: senderAccount,
            gasPrice: "20000000000",
            gas: "21000",
            value: "1000000000000000000"
        })
            .then((data) => {
                callback(data);
            })
            .catch((err) => {
                callback(err);
            });
    });
};