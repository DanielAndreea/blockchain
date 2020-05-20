var express = require('express');
var router = express.Router();
var DoctorService = require('../bll/doctor.bll');
var PatientService = require('../bll/patient.bll');
var fs = require('fs');
var path = require('path');
var LiverService = require('../bll/liver.bll');
var RegistryService = require('../bll/medicalRegistry.bll');

var abiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON = '././contracts/compiled/PatientContract_sol_PatientContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

var liverAbiJSON = 'D:/LICENTA/code/blockchain/contracts/compiled/D__LICENTA_code_blockchain_contracts_Liver_sol_Liver.abi';
var liverParsedABI = JSON.parse(fs.readFileSync(path.resolve(liverAbiJSON)));

var liverBinJSON = 'D:/LICENTA/code/blockchain/contracts/compiled/D__LICENTA_code_blockchain_contracts_Liver_sol_Liver.bin';
var liverBIN = fs.readFileSync(path.resolve(liverBinJSON));

var registryAbiJSON = 'D:/LICENTA/code/blockchain/contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.abi';
var registryParsedABI = JSON.parse(fs.readFileSync(path.resolve(registryAbiJSON)));

var registryBinJSON = 'D:/LICENTA/code/blockchain/contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.bin';
var registryBIN = fs.readFileSync(path.resolve(registryBinJSON));


router.post('/computeMELD', (req, res) => {
    const patientUsername = req.body.patientUsername;
    const doctorUsername = req.body.doctorUsername;
    const organ = req.body.organ;
    const bilirubin = req.body.bilirubin;
    const inr = req.body.inr;
    const creatinine = req.body.creatinine;
    const dialysis = req.body.dialysis;
    PatientService.getOrganAddressByName(parsedABI, patientUsername, organ, (organAddress) => {
        LiverService.computeScore(liverParsedABI, doctorUsername, organAddress, bilirubin, inr, creatinine, dialysis, (resp) => {
            LiverService.getScoreByDoctor(liverParsedABI, doctorUsername, organAddress, (score) => {
                RegistryService.markReceiver(registryParsedABI, doctorUsername, patientUsername, score, (response) => {
                    res.send(response)
                })
            })
            // res.send(resp)
        })
    })
})
;

module.exports = router;