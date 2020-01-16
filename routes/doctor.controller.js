var express = require('express');
var router = express.Router();
var DoctorService = require('../bll/doctor.bll');
var fs = require('fs');
var path = require('path')

var abiJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

router.post('/deploy', (req, res) => {
    const username = req.body.username;
    DoctorService.deployDoctorContract(username, parsedABI, '0x' + BIN, (data) => {
        console.log(data);
        res.send(data);
    })
})

router.post('/register', (req, res) => {
    const doctor = req.body.doctor;
    DoctorService.registerDoctor(doctor, () => {
        res.send(doctor);
    })
})


router.post('/register-contract', (req, res) => {
    const username = req.body.username;
    const doc = req.body.doctor;
    DoctorService.registerUpdateContract(parsedABI, username, doc);
})

router.get('/getDoctorData-contract', (req,res)=>{
    const account= req.body.account;
    const password = req.body.password;
    DoctorService.getDoctorData(parsedABI,account,password);
})
module.exports = router;