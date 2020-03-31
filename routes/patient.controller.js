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
});

router.post('/register', (req, res) => {
    const patient = req.body.patient;
    PatientService.registerPatient(patient, (patient) => {
        res.send(patient);
    });
});

router.get('/getMongoIdentifier', (req, res) => {
    PatientService.getPatientIdentifier(req.body.account);
});

router.post('/register-contract', (req, res) => {
    const username = req.body.username;
    PatientService.registerUpdateContract(parsedABI, username, (data) => {
        res.send(data);
    });

});

router.get('/getPatientData-contract', (req, res) => {
    const username = req.body.username;
    const organ = req.body.organ;
    PatientService.getPatientData(parsedABI, username, organ, (data) => {
        res.send(data);
    });
});

router.post('/addOrganToMap', (req, res) => {
    const username = req.body.username;
    const organ = req.body.organ;
    PatientService.addOrganToPatientMap(parsedABI, username, organ, (data) => {
        res.send(data);
    })
});

router.get('/getOrganByName', (req, res) => {
    const organ = req.body.organ;
    const username = req.body.username;
    console.log(organ)
    console.log(username)
    PatientService.getOrganAddressByName(parsedABI, username, organ, (data) => {
        res.send(data);
    })
})
module.exports = router;