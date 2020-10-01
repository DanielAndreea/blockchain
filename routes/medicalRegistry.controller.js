var express = require('express');
var router = express.Router();
var RegistryService = require('../bll/medicalRegistry.bll');
var fs = require('fs');
var path = require('path');

var registryAbiJSON = '././contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.abi';
var registryParsedABI = JSON.parse(fs.readFileSync(path.resolve(registryAbiJSON)));

var registryBinJSON = '././contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.bin';
var registryBIN = fs.readFileSync(path.resolve(registryBinJSON));

var patientAbiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var patientParsedABI = JSON.parse(fs.readFileSync(path.resolve(patientAbiJSON)));

var patientBinJSON = '././contracts/compiled/PatientContract_sol_PatientContract.bin';
var patientBIN = fs.readFileSync(path.resolve(patientBinJSON));

var doctorAbiJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.abi';
var doctorParsedABI = JSON.parse(fs.readFileSync(path.resolve(doctorAbiJSON)));

var doctorBinJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.bin';
var doctorBIN = fs.readFileSync(path.resolve(doctorBinJSON));

router.post('/deploy', (req,res) =>{
    RegistryService.deployMedicalRegistryContract(registryParsedABI, '0x' + registryBIN, (response)=>{
        res.send(response)
    })
});

router.get('/receivers', (req, res) => {
    RegistryService.getReceivers(registryParsedABI, (response) => {
        RegistryService.getReceiversFinal(patientParsedABI,doctorParsedABI,response, (resp) =>{
            res.send(resp)
        })
    })
});


router.get('/donors', (req, res) => {
    RegistryService.getDonors(registryParsedABI, (response) => {
        res.send(response)
    })
});

module.exports = router;