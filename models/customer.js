const mongoose = require('mongoose');
const schema = mongoose.Schema;

const customerSchema = new schema({

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

    coordinates: {
        lat: {
            type: String
        },
        long: {
            type: String
        }
    },

    registered: {
        type: Boolean,
        default: false
    },
});

const customerModel = mongoose.model("customer", customerSchema);

module.exports = customerModel;