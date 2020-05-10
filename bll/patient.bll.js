var patientDao = require('../dao/patient.dao');
var doctorDao = require('../dao/doctor.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var ethPatientDao = require('../eth-dao/eth.patient.dao');
var loadService = require('../utils/loadContract');
var encryptService = require('../bll/encrypt.bll');
const contractPatientType = 'PATIENT_CONTRACT';
var medicalRegistry = require('../bll/medicalRegistry.bll');

exports.registerPatient = function (patient, callback) {
    encryptService.generateKeys(patient.username, (publicKey) => {
        let patientToInsert = new UserModel({
            username: patient.username,
            password: patient.password,
            role: patient.role,
            account: patient.account,
            accountPassword: patient.accountPassword,
            publicKey: publicKey
        });

        patientDao.registerPatient(patientToInsert, callback);
    })

};


exports.deployPatientContract = function (username, abi, bin, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        deployService.deploy(abi, bin, patient[0].account, patient[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractPatientType,
                contractAddress: address,
                contractOwner: patient[0].account
            });
            patientDao.saveContract(contractToInsert, callback);
        })
    })
};


exports.registerUpdateContract = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.registerPatientInContract(patient[0].account,
                    patient[0].accountPassword,
                    contractAddress,
                    contract,
                    "newId",
                    callback);
            });
        });
    });
};


exports.getPatientData = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getPatientDataFromContract(patient[0].account, patient[0].accountPassword, contract, (patient) => {
                    callback(patient);
                })
            });
        });
    })
}

exports.addDoctorToPatientMap = function (abi, username, doctorContractAddress, status, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                let response = ethPatientDao.addDoctorToPatientMap(patient[0].account,
                    patient[0].accountPassword,
                    doctorContractAddress,
                    status,
                    contractAddress,
                    contract, (response) => {
                        if (response) {
                            callback(response);
                        }
                    });
            })
        })
    })
};

exports.addOrganToPatientMap = function (abi, patientUsername,docUsername, organ, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                    patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                        loadService.loadContract(abi, contractAddress, (contract) => {
                            ethPatientDao.addOrganToMap(doctor[0].account,
                                doctor[0].accountPassword,
                                organ,
                                contractAddress,
                                contract,
                                (res) => {
                                    console.log(res);
                                    callback(res);
                                }
                            )
                        })
                    })
                }
            )
        })
    })
};

exports.getOrganAddressByName = function (abi, username, organ, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getOrganAddressByName(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    organ,
                    (res) => {
                        console.log(res);
                        callback(res);
                    })
            })
        })
    })
};

exports.getPatientByAccount = function (account) {
    return new Promise(resolve => patientDao.getPatientByAccount(account, (p) =>
        resolve(p))
    );
};

exports.addFileHash = function (abi, username, hash, name, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.addFileHash(patient[0].account,
                    patient[0].accountPassword,
                    hash,
                    name,
                    contractAddress,
                    contract,
                    (response) => {
                        console.log(response);
                        callback(response)
                    })
            })
        })
    })
};

exports.getDocuments = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getDocuments(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    (response) => {
                        callback(response)
                    })
            })
        })
    })
};

exports.markPatientAsDonor = function (abi, docUsername, patientUsername, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                    loadService.loadContract(abi, contractAddress, (contract) => {
                        ethPatientDao.markPatientAsDonor(doctor[0].account,
                            doctor[0].accountPassword,
                            contractAddress,
                            contract,
                            (response) => {
                                callback(response)
                            })
                    })
                })
            })

        })
    })
};

exports.markPatientAsReceiver = function (abi, docUsername, patientUsername, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                    loadService.loadContract(abi, contractAddress, (contract) => {
                        ethPatientDao.markPatientAsReceiver(doctor[0].account,
                            doctor[0].accountPassword,
                            contractAddress,
                            contract,
                            (response) => {
                                callback(response)
                            })
                    })
                })
            })

        })
    })
};