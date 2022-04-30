const express = require('express');
const router = express.Router();

const { getRoute, registerDriver, updatePickupStatus } = require("../controllers/driver");
const { protect, restrictTo } = require('./../controllers/authcontroller');


router.get('/employee/start-pickup',protect, restrictTo('employee'), getRoute)

router.post('/update/employee-details', protect, restrictTo('employee'), registerDriver);
router.get('/update/employee-details',protect, restrictTo('employee'), (req,res) => {
    res.render("employeeDetails")
})

router.get('/verify/qr/:uid/:date',protect, restrictTo('employee'), updatePickupStatus);

module.exports = router;