var express = require('express');
var router = express.Router();
var PatientService = require('../bll/patient.bll');
var fs = require('fs');
var path = require('path');

var abiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON = '././contracts/compiled/PatientContract_sol_PatientContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

router.post('/deploy', (req, res) => {
    const username = req.body.username;
    PatientService.deployPatientContract(username, parsedABI, '0x' + BIN, (data) => {
        console.log(data);
        res.send(data);
    });
})

router.post('/register', (req, res) => {
    const patient = req.body.patient;
    PatientService.registerPatient(patient,() =>{
        res.send(patient);
    });
})

router.get('/getMongoIdentifier', (req, res) => {
    PatientService.getPatientIdentifier(req.body.account);
})

router.post('/register-contract', (req, res) => {
    const username = req.body.username;
    PatientService.registerUpdateContract(parsedABI, username);
})

router.get('/getPatientData-contract', (req, res) => {
    const account = req.body.account;
    const password = req.body.password;
    PatientService.getPatientData(parsedABI, account, password);
})
module.exports = router;