var requestsDao = require('../dao/requests.dao');

exports.createRequest = function (doctor, patient, hash,name, callback) {
    requestsDao.createNewRequest(doctor, patient, hash,name, callback);
};

exports.getPatientRequests = function (patient, callback) {
    requestsDao.getAllRequestsForPatient(patient, callback);
};

exports.getDoctorRequests = function (doctor, callback) {
    requestsDao.getAllRequestsForDoctor(doctor, callback);
};

exports.updateRequest = function (id, callback) {
    requestsDao.updateRequestStatus(id, callback);
};