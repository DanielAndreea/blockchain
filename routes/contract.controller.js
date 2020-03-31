var express = require('express');
var router = express.Router();
var contractService = require('../bll/contract.bll');

router.get('/getAllContracts', (req, res) => {
    contractService.getAllContracts((data) => {
        res.send(data);
    })
});


module.exports = router;