var express = require('express');
var router = express.Router();
var RegistryService = require('../bll/medicalRegistry.bll');
var fs = require('fs');
var path = require('path');

var registryAbiJSON = 'D:/LICENTA/code/blockchain/contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.abi';
var registryParsedABI = JSON.parse(fs.readFileSync(path.resolve(registryAbiJSON)));

var registryBinJSON = 'D:/LICENTA/code/blockchain/contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.bin';
var registryBIN = fs.readFileSync(path.resolve(registryBinJSON));

router.post('/deploy', (req,res) =>{
    RegistryService.deployMedicalRegistryContract(registryParsedABI, '0x' + registryBIN, (response)=>{
        res.send(response)
    })
});

router.get('/receivers', (req, res) => {
    RegistryService.getReceivers(registryParsedABI, (response) => {
        res.send(response)
    })
});


router.get('/donors', (req, res) => {
    RegistryService.getDonors(registryParsedABI, (response) => {
        res.send(response)
    })
});

module.exports = router;