var express = require('express');
var router = express.Router();
var signedTx = require('../bll/signedTransaction');
var unlockAccount = require('../bll/unlockAccount');
var deploy = require('../bll/deploy');
var write = require('../bll/writeContract');
var events = require('../bll/events');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/accounts', function(req,res,next){
  console.log('provider' , web3.currentProvider);
  web3.eth.isMining().then(console.log);
  web3.eth.getAccounts()
      .then(function(block) {
        console.log(block);
        res.send(block);
      });
})

//transaction using ganache accounts
router.post('/transaction', function(req,res,next){
  console.log('provider' , web3.currentProvider);
  web3.eth.isMining().then(console.log);
  var acc1 = '0xf49ad8b5B0218d457f7763E212Cc2904E8965d92';
  var acc2 = '0xFC707311C55b0C3F04B6b461D6849ABC7A235b80';
  web3.eth.sendTransaction({from: acc1, to: acc2, value: web3.utils.toWei('1','ether')});
})

//get balance of specified account
router.get('/balance', function(req,res,next){
  var acc1 = req.body.account;
  web3.eth.getBalance(acc1, function(err,result) {res.send(result); console.log(result)})
})

//TUTORIAL: SIGNED TRANSACTIONS
router.post('/signedTx', signedTx.signedTx);

//SEND TRANSACTION + UNLOCK ACCOUNTS -> local parity node
router.post('/unlockAccounts',unlockAccount.unlockAccounts );

//DEPLOY SMART CONTRACT -> using remix and ganache account
router.post('/deployContract',deploy.deployContract );

//ACCESS SMART CONTRACT METHODS
router.post('/writeContract', write.writeContract);

//EVENTS
router.get('/events', events.events);
module.exports = router;
