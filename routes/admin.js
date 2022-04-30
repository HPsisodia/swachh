const express = require('express');
const router = express.Router();

const { fetchCustomers, fetchEmployees, todayPickup, getRequestDetails, approvePickupRequest } = require("../controllers/admin");
const { protect, restrictTo } = require('./../controllers/authcontroller');

router.get('/fetch/customer', protect, restrictTo('admin'), fetchCustomers);
router.get('/details/customer',protect, restrictTo('admin'), (req,res) => {
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .render("fetchAllCustomers")
})


router.get('/fetch/employee', protect, restrictTo('admin'), fetchEmployees);
router.get('/details/employee',protect, restrictTo('admin'), (req,res) => {
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .render("fetchAllEmployees")
})

router.get('/admin/todaypickup', protect, restrictTo('admin'), todayPickup);
router.get('/admin/today-pickup',protect, restrictTo('admin'), (req,res) => {
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .render("todayPickup")
})

router.get('/admin/show-pickup-request', protect, restrictTo('admin'), getRequestDetails);
router.get('/admin/show-request',protect, restrictTo('admin'), (req,res) => {
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
    .render("approvePickupRequest")
})

router.get('/admin/requestapproved/:uid/:date', protect, restrictTo('admin'), approvePickupRequest);

module.exports = router;