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
var crypto = require('crypto');

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


exports.registerUpdateContract = function (abi, username, ssn, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                var mykey = crypto.createCipher('aes-128-cbc', 'something-secret');
                var mystr = mykey.update(username + ssn, 'utf8', 'hex')
                mystr += mykey.final('hex');
                ethPatientDao.registerPatientInContract(patient[0].account,
                    patient[0].accountPassword,
                    contractAddress,
                    contract,
                    mystr,
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

exports.addOrganToPatientMap = function (abi, patientUsername, docUsername, organ, callback) {
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

exports.createRequest = function (abi, docUsername, patientUsername, fileHash,fileName, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                    loadService.loadContract(abi, contractAddress, (contract) => {
                        ethPatientDao.createRequest(doctor[0].account,
                            doctor[0].accountPassword,
                            contractAddress,
                            contract,
                            docContractAddress,
                            fileHash,
                            fileName,
                            (response) => {
                                callback(response)
                            })
                    })
                })
            })
        })
    })
};

exports.approveRequest = function (abi, docUsername, patientUsername, fileHash, callback) {
    doctorDao.getDoctorByUsername(docUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            patientDao.getPatientByUsername(patientUsername, (patient) => {
                patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
                    loadService.loadContract(abi, contractAddress, (contract) => {
                        ethPatientDao.approveRequest(doctor[0].account,
                            doctor[0].accountPassword,
                            contractAddress,
                            contract,
                            docContractAddress,
                            (response) => {
                                callback(response)
                            })
                    })
                })
            })
        })
    })
};

//TODO: get requests for doctor (split map key and extract doctor contract address)
exports.getRequests = function (abi, username, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethPatientDao.getRequests(patient[0].account,
                    patient[0].accountPassword,
                    contract,
                    (response) => {
                        callback(response)
                    })
            })
        })
    })
};

exports.setTrustedPerson = function (abi, username, personUsername, callback) {
    patientDao.getPatientByUsername(username, (patient) => {
        patientDao.getContractAddressByAccount(patient[0].account, (contractAddress) => {
            patientDao.getPatientByUsername(personUsername, (trusted) => {
                loadService.loadContract(abi, contractAddress, (contract) => {
                    ethPatientDao.setTrustedPerson(patient[0].account,
                        patient[0].accountPassword,
                        contract,
                        contractAddress,
                        trusted[0].account,
                        (response) => {
                            callback(response)
                        })
                })
            })
        })
    })
};
