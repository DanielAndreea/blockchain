var express = require('express');
var router = express.Router();
var PatientService = require('../bll/patient.bll');
var LiverService = require('../bll/liver.bll');
var RegistryService = require('../bll/medicalRegistry.bll');
var fs = require('fs');
var path = require('path');

var abiJSON = '././contracts/compiled/PatientContract_sol_PatientContract.abi';
var parsedABI = JSON.parse(fs.readFileSync(path.resolve(abiJSON)));

var binJSON = '././contracts/compiled/PatientContract_sol_PatientContract.bin';
var BIN = fs.readFileSync(path.resolve(binJSON));

var liverAbiJSON = '././contracts/compiled/D__LICENTA_code_blockchain_contracts_Liver_sol_Liver.abi';
var liverParsedABI = JSON.parse(fs.readFileSync(path.resolve(liverAbiJSON)));

var liverBinJSON = '././contracts/compiled/D__LICENTA_code_blockchain_contracts_Liver_sol_Liver.bin';
var liverBIN = fs.readFileSync(path.resolve(liverBinJSON));

var registryAbiJSON = '././contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.abi';
var registryParsedABI = JSON.parse(fs.readFileSync(path.resolve(registryAbiJSON)));

var registryBinJSON = '././contracts/compiled/MedicalRegistryContract_sol_MedicalRegistry.bin';
var registryBIN = fs.readFileSync(path.resolve(registryBinJSON));

var docabiJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.abi';
var docparsedABI = JSON.parse(fs.readFileSync(path.resolve(docabiJSON)));

var docbinJSON = '././contracts/compiled/DoctorContract_sol_DoctorContract.bin';
var docBIN = fs.readFileSync(path.resolve(docbinJSON));

router.post('/deploy', (req, res) => {
    const username = req.body.username;
    PatientService.deployPatientContract(username, parsedABI, '0x' + BIN, (data) => {
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
    const ssn = req.body.ssn;
    PatientService.registerUpdateContract(parsedABI, username, ssn, (data) => {
        res.send(data);
    });

});

router.get('/getPatientData-contract/:username', (req, res) => {
    const username = req.params.username;
    PatientService.getPatientData(parsedABI, username, (data) => {
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
    PatientService.getOrganAddressByName(parsedABI, username, organ, (data) => {
        res.send(data);
    })
});

router.post('/addHash', (req, res) => {
    const hash = req.body.hash;
    const name = req.body.name;
    const username = req.body.username;
    PatientService.addFileHash(parsedABI, username, hash, name, (data) => {
        res.send(data);
    })
});

router.get('/getDocuments/:username', (req, res) => {
    const username = req.params.username;
    PatientService.getDocuments(parsedABI, username, (data) => {
        res.send(data)
    })
});

router.get('/getScore/:organ/:username', (req, res) => {
    const organ = req.params.organ;
    const username = req.params.username;
    PatientService.getOrganAddressByName(parsedABI, username, organ, (organAddress) => {
        LiverService.getScoreByPatient(liverParsedABI, username, organAddress, (score) => {
            res.send(score)
        })
    })
});

router.post('/markDonor', (req, res) => {
    const doctorUsername = req.body.doctorUsername;
    const patientUsername = req.body.patientUsername;
    PatientService.markPatientAsDonor(parsedABI, doctorUsername, patientUsername, (response) => {
        RegistryService.markDonor(registryParsedABI, doctorUsername, patientUsername, (resp) => {
            res.send(resp)
        });

    })
});

router.post('/markReceiver', (req, res) => {
    const doctorUsername = req.body.doctorUsername;
    const patientUsername = req.body.patientUsername;
    PatientService.markPatientAsReceiver(parsedABI, doctorUsername, patientUsername, (response) => {
        PatientService.addOrganToPatientMap(parsedABI, patientUsername, doctorUsername, 'LIVER', (resp) => {
            res.send(resp);
        });
    })
});

router.post('/createRequest', (req, res) => {
    const doctor = req.body.doctorUsername;
    const patient = req.body.patientUsername;
    const hash = req.body.fileHash;
    const name = req.body.fileName;
    PatientService.createRequest(parsedABI, docparsedABI, doctor, patient, hash, name, (response, err) => {
        if (err) res.send('Error');
        res.send(response);
    })
});

router.post('/approveRequest', (req, res) => {
    const doctor = req.body.doctorUsername;
    const patient = req.body.patientUsername;
    const hash = req.body.fileHash;
    const mapKey = req.body.id;
    PatientService.approveRequest(parsedABI, docparsedABI, doctor, patient, hash, mapKey, (response, err) => {
        if (err) res.send('Error');
        res.send(response);
    })
});

router.post('/setTrustedPerson', (req, res) => {
    const patient = req.body.patientUsername;
    const person = req.body.personUsername;
    PatientService.setTrustedPerson(parsedABI, patient, person, (response) => {
        res.send(response);
    })
});

router.get('/getRequests/:username', (req, res) => {
    const username = req.params.username;
    PatientService.getRequests(parsedABI, username, (data) => {
        res.send(data)
    })
});
module.exports = router;