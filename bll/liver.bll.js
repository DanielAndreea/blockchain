var ethLiverDao = require('../eth-dao/eth.liver.dao');
var loadService = require('../utils/loadContract');
var doctorDao = require('../dao/doctor.dao');
var patientDao = require('../dao/patient.dao');

exports.computeScore = function (abi, username, organAddress, bilirubin, inr, creatinine, dialysis, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, organAddress, (contract) => {
                ethLiverDao.computeMeldScore(doctor[0].account,
                    doctor[0].accountPassword,
                    organAddress,
                    contract,
                    bilirubin,
                    inr,
                    creatinine,
                    dialysis,
                    callback)
            })
        })
    })
};

exports.getScoreByDoctor = function(abi,username,organContractAddress,callback){
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, organContractAddress, (contract) => {
                ethLiverDao.getScoreForLiver(doctor[0].account,
                    doctor[0].accountPassword,
                    contract,
                    callback)
            })
        })
    })
}

exports.getScoreByPatient = function(abi,username,organContractAddress, callback){
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, organContractAddress, (contract) => {
                ethLiverDao.getScoreForLiver(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    callback)
            })
        })
    })
}