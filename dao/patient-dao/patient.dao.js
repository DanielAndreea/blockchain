
exports.registerPatient = function (patientToInsert) {
    patientToInsert.save()
        .then(data => {
            console.log('SAVED PATIENT TO DB: ', data);
            // saveContract(contract);
        })
        .catch(error => console.log('FROM PATIENT DAO ', error));
}

exports.saveContract = function(contractToInsert) {
    contractToInsert.save()
        .then(data => {
            console.log('SAVED CONTRACT TO DB: ', data);
        })
        .catch(error => console.log('FROM PATIENT DAO ', error));
}
