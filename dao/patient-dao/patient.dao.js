
exports.registerPatient = function (patientToInsert, contract) {
    patientToInsert.save()
        .then(data => {
            console.log('SAVED PATIENT TO DB: ', data);
            saveContract(contract);
        })
        .catch(error => console.log('FROM PATIENT DAO ', error));
}

function saveContract(contractToInsert) {
    contractToInsert.save()
        .then(data => {
            console.log('SAVED CONTRACT TO DB: ', data);
        })
        .catch(error => console.log('FROM PATIENT DAO ', error));
}
