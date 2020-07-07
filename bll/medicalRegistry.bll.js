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
        (result) => {
            callback(quickSort(result, 0, result.length-1));
        }
    )
};

function swap(items, leftIndex, rightIndex) {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    var pivot = parseInt(items[Math.floor((right + left) / 2)].info.info.score);
    var i = left;
    var j = right;
    while (i <= j) {
        while (parseInt(items[i].info.info.score) > pivot) {
            i++;
        }
        while (parseInt(items[j].info.info.score) < pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right);
        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }
        if (index < right) {
            quickSort(items, index, right);
        }
    }
    return items;
}

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
