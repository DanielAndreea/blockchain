var ethMedicalRegistryDao = require('../eth-dao/eth.medicalRegistry.dao');
var doctorDao = require('../dao/doctor.dao');
var loadService = require('../utils/loadContract');
var patientDao = require('../dao/patient.dao');
var deployService = require('../utils/deploy');
var contractDao = require('../dao/contract.dao');
var account = '0x76FBA49331c531564A67BdfEF8E0bD2F36653322';
var password = 'passphrase-generator';
var ethPatientDao = require('../eth-dao/eth.patient.dao');
var ethDoctorDao = require('../eth-dao/eth.doctor.dao');

var ContractModel = require('../models/contract.model');


exports.deployMedicalRegistryContract = function (abi, bin, callback) {
    deployService.deploy(abi, bin, account, password, (address) => {
        let contractToInsert = new ContractModel({
            contractName: 'MEDICAL_REGISTRY',
            contractAddress: address,
            contractOwner: account
        });
        patientDao.saveContract(contractToInsert, callback);
    })
};

exports.markDonor = function (abi, docUsername, patientUsername, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContract) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (patientContractAddress) => {
                    contractDao.getContractByType('MEDICAL_REGISTRY', (medicalRegistryContract) => {
                        loadService.loadContract(abi, medicalRegistryContract[0].contractAddress, (contract) => {
                            ethMedicalRegistryDao.markPatientAsDonorInRegistry(
                                doctor[0].account,
                                doctor[0].accountPassword,
                                patientContractAddress,
                                medicalRegistryContract[0].contractAddress,
                                contract,
                                (res) => callback(res)
                            )
                        })
                    })
                })
            })
        })
    })
};

exports.markReceiver = function (abi, docUsername, patientUsername, score, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContract) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (patientContractAddress) => {
                    contractDao.getContractByType('MEDICAL_REGISTRY', (medicalRegistryContract) => {
                        loadService.loadContract(abi, medicalRegistryContract[0].contractAddress, (contract) => {
                            ethMedicalRegistryDao.markPatientAsReceiverInRegistry(
                                doctor[0].account,
                                doctor[0].accountPassword,
                                patientContractAddress,
                                docContract,
                                score,
                                medicalRegistryContract[0].contractAddress,
                                contract,
                                (res) => callback(res)
                            )
                        })
                    })
                })
            })
        })
    })
};


exports.getReceivers = function (abi, callback) {
    contractDao.getContractByType('MEDICAL_REGISTRY', (medicalRegistryContract) => {
        loadService.loadContract(abi, medicalRegistryContract[0].contractAddress, (contract) => {
            ethMedicalRegistryDao.getReceivers(
                account,
                password,
                contract,
                (res) => {
                    ethMedicalRegistryDao.getReceiversDetails(
                        account,
                        password,
                        contract,
                        res,
                        callback
                    )
                }
            )
        })
    })
};

exports.getReceiversFinal = function (patientAbi, doctorAbi, list, callback) {
    ethMedicalRegistryDao.getFinalListReceivers(
        account,
        password,
        patientAbi,
        doctorAbi,
        list,
        callback
    )
};


exports.getDonors = function (abi, callback) {
    contractDao.getContractByType('MEDICAL_REGISTRY', (medicalRegistryContract) => {
        loadService.loadContract(abi, medicalRegistryContract[0].contractAddress, (contract) => {
            ethMedicalRegistryDao.getDonors(
                account,
                password,
                contract,
                (res) => {
                    ethMedicalRegistryDao.getDonorsDetails(
                        account,
                        password,
                        contract,
                        res,
                        callback
                    )
                }
            )
        })
    })
};
