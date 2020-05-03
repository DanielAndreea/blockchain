var express = require('express');
var router = express.Router();
var DoctorService = require('../bll/doctor.bll');
var fs = require('fs');
var path = require('path')

var abiJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

var patientAbiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var patientParsedABI = JSON.parse(fs.readFileSync(path.resolve(patientAbiJSON)));

var patientBinJSON = '././contracts/compiled/PatientContract_sol_PatientContract.bin';
var patientBIN = fs.readFileSync(path.resolve(patientBinJSON));

router.post('/deploy', (req, res) => {
    const username = req.body.username;
    DoctorService.deployDoctorContract(username, parsedABI, '0x' + BIN, (data) => {
        console.log(data);
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
    DoctorService.registerUpdateContract(parsedABI, username, doc, (resp) =>{
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
    DoctorService.consultPatient(parsedABI, patientParsedABI, patientUsername, doctorUsername, (data) => {
        res.send(data)
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
    console.log(doctorUsername)
    DoctorService.getAllConsultedPatients(parsedABI, doctorUsername, (result) => {
        res.send(result)
    })
})
module.exports = router;