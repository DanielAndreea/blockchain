var doctorDao = require('../dao/doctor.dao');
var patientDao = require('../dao/patient.dao');
var UserModel = require('../models/user.model');
var ContractModel = require('../models/contract.model');
var deployService = require('../utils/deploy');
var loadService = require('../utils/loadContract');
var ethDoctorDao = require('../eth-dao/eth.doctor.dao');
var patientBll = require('../bll/patient.bll');
var encryptService = require('../bll/encrypt.bll');

const contractDoctorType = 'DOCTOR_CONTRACT';

exports.registerDoctor = function (doctor, callback) {
    encryptService.generateKeys(doctor.username, (publicKey) => {

        let doctorToInsert = new UserModel({
            username: doctor.username,
            password: doctor.password,
            role: doctor.role,
            account: doctor.account,
            accountPassword: doctor.accountPassword,
            publicKey: publicKey
        });
        doctorDao.registerDoctor(doctorToInsert, callback);
    })
};

exports.deployDoctorContract = function (username, abi, bin, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        deployService.deploy(abi, bin, doctor[0].account, doctor[0].accountPassword, (address) => {
            let contractToInsert = new ContractModel({
                contractName: contractDoctorType,
                contractAddress: address,
                contractOwner: doctor[0].account
            });
            doctorDao.saveContract(contractToInsert, (data) => {
                callback(data)
            });
        });
    });
};

exports.registerUpdateContract = function (abi, username, doc, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log(doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.registerDoctorInContract(doctor[0].account, doctor[0].accountPassword, contractAddress, contract, doc, callback);
            });
        });
    });
}

exports.getDoctorData = function (abi, username, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log(doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            console.log("Contract address: ", contractAddress);
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getDoctorDataFromContract(doctor[0].account, doctor[0].accountPassword, contract, (doc) => {
                    console.log("From blockchain: ", doc);
                    callback(doc);
                })
            });
        })
    });
};

exports.consultPatient = function (docAbi, patientAbi, patientUsername, doctorUsername, callback) {
    doctorDao.getDoctorByUsername(doctorUsername, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (docContractAddress) => {
            loadService.loadContract(docAbi, docContractAddress, (contract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    patientDao.getContractAddressByAccount(patient[0].account, (patientContractAddress) => {
                        let data = ethDoctorDao.consultPatient(
                            doctor[0].account,
                            doctor[0].accountPassword,
                            docContractAddress,
                            contract,
                            patient[0].account,
                            patientContractAddress, (res) => {
                                if (res) {
                                    patientBll.addDoctorToPatientMap(patientAbi, patientUsername, docContractAddress, 'TRUE', (response) => {
                                        callback(response)
                                    })
                                } else console.log('NO DATA RETURNED')
                            }
                        );
                    })
                })
            })
        })
    })
};

exports.getConsultedPatient = function (abi, username, patientUsername, callback) {
    doctorDao.getDoctorByUsername(username, (doctor) => {
        console.log('PATIENT: ', doctor);
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            console.log('CONTRACT ADDRESS: ', contractAddress);
            loadService.loadContract(abi, contractAddress, (contract) => {
                patientDao.getPatientByUsername(patientUsername, (patient) => {
                    ethDoctorDao.getConsultedPatient(doctor[0].account,
                        doctor[0].accountPassword,
                        contract,
                        contractAddress,
                        patient[0].account,
                        (res) => {
                            console.log(res);
                            callback(res);
                        })
                })
            })
        })
    })
};

exports.getAllConsultedPatients = function (abi, username, callback) {
    var patients = [];
    doctorDao.getDoctorByUsername(username, (doctor) => {
        doctorDao.getContractAddressByAccount(doctor[0].account, (contractAddress) => {
            loadService.loadContract(abi, contractAddress, (contract) => {
                ethDoctorDao.getAllConsultedPatients(doctor[0].account,
                    doctor[0].accountPassword,
                    contract,
                    async (res) => {
                        for (let i = 0; i < res.length; i++) {
                            let p = await patientBll.getPatientByAccount(res[i]);
                            patients.push(p)
                        }
                        callback(patients)
                    })
            })
        })
    })
};