const mongoose = require('mongoose');
const schema = mongoose.Schema;

const employeeSchema = new schema({

    uid: {
        type: String
    },

    name: {
        type: String
    },

    email: {
        type: String,
    },

    phoneno: {
        type: String
    },

    address: {
        type: String
    },

    designation: {
        type: String
    },

});

const employeeModel = mongoose.model("employee", employeeSchema);

module.exports = employeeModel;