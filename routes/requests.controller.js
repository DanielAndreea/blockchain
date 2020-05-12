var express = require('express');
var router = express.Router();
var requestsService = require('../bll/requests.bll');

router.post('/create', (req, res) => {
    const doctor = req.body.doctorUsername;
    const patient = req.body.patientUsername;
    const hash = req.body.fileHash;
    const name = req.body.name;
    requestsService.createRequest(doctor, patient, hash,name, (response) => {
        console.log('good')
        res.send(response);
    })
});

router.get('/patient/requests/:patient', (req, res) => {
    const patient = req.params.patient;
    requestsService.getPatientRequests(patient, (response) => {
        res.send(response)
    })
});

router.get('/doctor/requests/:doctor', (req, res) => {
    const doctor = req.params.doctor;
    requestsService.getDoctorRequests(doctor, (response) => {
        res.send(response)
    })
});

router.put('/updateRequest/:id', (req, res) => {
    const id = req.params.id;
    requestsService.updateRequest(id, (response) => {
        res.send(response)
    })
});


module.exports = router;