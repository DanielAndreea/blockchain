exports.unlockAccounts = function(req,res){
    //5th account from list
    var acc1 = '0x0b1232F6F7567dEcA878d7595183BBEd36459a1c';
    //password: passphrase-prosumer3
    var pass1 = 'passphrase-prosumer3';

    //first account from list
    var acc2 = '0x04Fb94F5E2555d1E860462060337Aa62ec6e919d';
    //password: user-acc
    var pass2 = 'user-acc';



    web3.eth.personal.unlockAccount(acc1, pass1, null, (err) => {
        if (err) {
            console.log('first account locked', err);
        } else console.log('first account unlocked');
        web3.eth.personal.unlockAccount(acc2, pass2, null, (err) => {
            if (err) {
                console.log(err);
            } else console.log('second account unlocked');
            web3.eth.sendTransaction({from: acc1, to: acc2, value: web3.utils.toWei('1', 'ether')});
        })
    })

    res.send('done');
}