const mongoose = require('mongoose');
const schema = mongoose.Schema;

const garbagePickupSchema = new schema({

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

    pickup: {
        type: Boolean,
        default: false
    },

    approved: {
        type: Boolean,
        default: false
    },

    date: {
        type: String 
    }
});

const garbagePickupModel = mongoose.model("garbagePickup", garbagePickupSchema);

module.exports = garbagePickupModel;