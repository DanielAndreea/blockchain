var express = require('express');
var router = express.Router();
var userService = require('../bll/user.bll');

router.get('/getAllUsers', (req, res) => {
    userService.getAllUsers((data) => {
        res.send(data);
    })
});


router.get('/getPatientUsers', (req, res) => {
    userService.getPatientUsers((patients) => {
        res.send(patients);
    })
});
module.exports = router;