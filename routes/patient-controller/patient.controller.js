var express = require('express');
var router = express.Router();
var PatientService = require('../../bll/patient-bll/patient.bll');
var fs = require('fs');
var path = require('path');

var abiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON ='././contracts/compiled/PatientContract_sol_PatientContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

//first deployed contract: 0x14b8766224f5A22791d7f27abF2e23b731296358
let deployAddress = '';
router.post('/deploy', (req,res) => {
    const account = req.body.account;
    const password = req.body.password;

   PatientService.deployPatientContract(account,password,parsedABI,'0x'+BIN, (data) =>{
       console.log(data);
       res.send(data);
   });
})

router.post('/register', (req,res) =>{
    const patient = req.body.patient;
    PatientService.registerPatient(patient);
})
module.exports = router;