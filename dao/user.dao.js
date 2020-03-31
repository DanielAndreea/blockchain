var UserModel = require('../models/user.model');


//TODO: GET ALL PATIENTS ONLY FOR A MEDIC ??? OR DISPLAY ALL OF THEM AND
//TODO: HAVE ACCESS ONLY TO THOSE WHO HAVE DOC IN MAP
exports.getAllUsers = function (callback) {
    UserModel.find({})
        .then((list) => {
            console.log(list);
            callback(list);
        })
        .catch(console.log);
}