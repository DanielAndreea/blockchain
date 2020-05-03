exports.computeMeldScore = function(account,password,contractAddress,contract,bilirubin,inr,creatinine,dialysis,callback){
    web3.eth.personal.unlockAccount(account,password,null,(err) =>{
        if(err) callback(err);
        web3.eth.sendTransaction(
            {
                to: contractAddress,
                from: account,
                data: contract.methods.computeMELD(bilirubin, inr, creatinine, dialysis).encodeABI()
            })
            .then((data) =>{
                callback(data)
            })
            .catch((err) =>{
                callback(err)
            })

    })
};


exports.getScoreForLiver = function(account,password,contract,callback){
    web3.eth.personal.unlockAccount(account,password,null,(err)=>{
        if(err) callback(err);
        contract.methods.receiveScore().call(null, (err, score)=>{
            if(err) callback(err)
            callback(score)
        })
    })
};
