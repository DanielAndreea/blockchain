var express = require('express');
var router = express.Router();
var userService = require('../bll/user.bll');

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    userService.login(username, password, (response) => {
        res.send(response);
    })
});

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