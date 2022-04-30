const mongoose = require('mongoose');
const schema = mongoose.Schema;

const pickupRequestSchema = new schema({

    uid: {
        type: String
    },
    
    name: {
        type: String
    },

    phoneno: {
        type: String
    },

    address: {
        type: String
    },

    lat: {
        type: String
    },
    
    long: {
        type: String
    },

    reason: {
        type: String
    },

    date: {
        type: String 
    },

    approved: {
        type: Boolean,
        default: false
    }
});

const pickupRequestModel = mongoose.model("pickupRequest", pickupRequestSchema);

module.exports = pickupRequestModel;