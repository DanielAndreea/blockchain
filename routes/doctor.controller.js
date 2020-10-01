var express = require('express');
var router = express.Router();
var DoctorService = require('../bll/doctor.bll');
var PatientService = require('../bll/patient.bll');
var LiverService = require('../bll/liver.bll');

var fs = require('fs');
var path = require('path');

var abiJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

var patientAbiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var patientParsedABI = JSON.parse(fs.readFileSync(path.resolve(patientAbiJSON)));

var patientBinJSON = '././contracts/compiled/PatientContract_sol_PatientContract.bin';
var patientBIN = fs.readFileSync(path.resolve(patientBinJSON));

var liverAbiJSON = '././contracts/compiled/D__LICENTA_code_blockchain_contracts_Liver_sol_Liver.abi';
var liverParsedABI = JSON.parse(fs.readFileSync(path.resolve(liverAbiJSON)));

var liverBinJSON = '././contracts/compiled/D__LICENTA_code_blockchain_contracts_Liver_sol_Liver.bin';
var liverBIN = fs.readFileSync(path.resolve(liverBinJSON));

router.post('/deploy', (req, res) => {
    const username = req.body.username;
    DoctorService.deployDoctorContract(username, parsedABI, '0x' + BIN, (data) => {
        res.send(data);
    })
});

router.post('/register', (req, res) => {
    const doctor = req.body.doctor;
    DoctorService.registerDoctor(doctor, () => {
        res.send(doctor);
    })
});


router.post('/register-contract', (req, res) => {
    const username = req.body.username;
    const doc = req.body.doctor;
    DoctorService.registerUpdateContract(parsedABI, username, doc, (resp) => {
        res.send(resp)
    });
});

router.get('/getDoctorData-contract', (req, res) => {
    const username = req.body.username;
    DoctorService.getDoctorData(parsedABI, username, (data) => {
        res.send(data);
    });
});

router.post('/consult-patient', (req, res) => {
    const doctorUsername = req.body.doctorUsername;
    const patientUsername = req.body.patientUsername;
    const ssn = req.body.ssn;
    DoctorService.consultPatient(parsedABI, patientParsedABI, ssn, patientUsername, doctorUsername, (data) => {
        res.json(data)
    });
});

router.get('/getConsultedPatient', (req, res) => {
    const doctorUsername = req.body.doctorUsername;
    const patientUsername = req.body.patientUsername;
    DoctorService.getConsultedPatient(parsedABI, doctorUsername, patientUsername, (result) => {
        res.send(result);
    })
})

router.post('/getDoctorPatients', (req, res) => {
    const doctorUsername = req.body.username;
    DoctorService.getAllConsultedPatients(parsedABI, patientParsedABI, doctorUsername, (result) => {
        res.send(result)
    })
})

router.get('/getScore/:organ/:patientUsername/:doctorUsername', (req, res) => {
    const organ = req.params.organ;
    const patientUsername = req.params.patientUsername;
    const doctorUsername = req.params.doctorUsername;
    PatientService.getOrganAddressByName(patientParsedABI, patientUsername, organ, (organAddress) => {
        LiverService.getScoreByDoctor(liverParsedABI, doctorUsername, organAddress, (score) => {
            res.send(score)
        })
    })
});

router.get('/getDocRequests/:username', (req, res) => {
    const username = req.params.username;
    DoctorService.getRequests(parsedABI, username, (data) => {
        res.send(data)
    })
});
module.exports = router;