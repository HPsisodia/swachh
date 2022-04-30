const express = require('express');
const router = express.Router();

const { registerCustomer, updateCoordinates, pickupRequest, generateQR} = require("../controllers/customer");
const { protect, restrictTo } = require('./../controllers/authcontroller');


router.post('/register/pickup', protect, restrictTo('customer'), registerCustomer);
router.get('/register/pickup',protect, restrictTo('customer'), (req,res) =>{
    res.render("customerDetails");
})

router.post('/customer/pickup-request', protect, restrictTo('customer'), pickupRequest);
router.get('/customer/pickup-request',protect, restrictTo('customer'), (req,res) =>{
    res.render("pickupRequest");
})

router.get('/customer/generate-qr',protect, restrictTo('customer'), generateQR);


router.post('/customer/confirm-location', protect, restrictTo('customer'), updateCoordinates);



module.exports = router;