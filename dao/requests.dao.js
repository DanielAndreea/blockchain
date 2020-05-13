var RequestsModel = require('../models/requests.model');

exports.createNewRequest = function (doctor, patient, hash, name,callback) {
    let req = new RequestsModel({
        doctor: doctor,
        patient: patient,
        hash: hash,
        name: name,
        status: 'PENDING',
        date: new Date()
    });
    req.save()
        .then((data) => {
            callback(data)
        })
        .catch(error => {
            callback(error)
        })
};

exports.getAllRequestsForPatient = function (patient, callback) {
    console.log(patient)
    RequestsModel.find({patient: patient})
        .then(data => {
            callback(data)
        })
        .catch(error => callback(error))
};

exports.getAllRequestsForDoctor = function (doctor, callback) {
    RequestsModel.find({doctor: doctor})
        .then(data => callback(data))
        .catch(error => callback(error))
};

exports.updateRequestStatus = function (id, callback) {
    RequestsModel.find({_id: id})
        .then(data => {
            console.log(data)
            let newReq = new RequestsModel({
                _id: id,
                patient: data.patient,
                doctor: data.doctor,
                hash: data.hash,
                name: data.name,
                status: 'APPROVED',
                date: data.date,
            });
            RequestsModel.update({_id: id}, newReq)
                .then(data2 => callback(data2))
                .catch(error => callback(error))
        })
        .catch(error => callback(error))
};