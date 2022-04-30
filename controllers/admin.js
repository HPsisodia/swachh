const customerModel = require('./../models/customer');
const employeeModel = require('../models/employee');
const gPickupModel = require('../models/garbagepickup');
const pickupRequestModel = require('../models/pickuprequest');
const moment = require('moment');

require("dotenv").config();

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");

const { location } = require('../Helpers/wasteProcessingLocation');  


exports.fetchCustomers = async (req,res) =>{
    try {
        const customers = await customerModel.find();
        return res
            .status(statusCode.success)
            .json(
                returnJsonResponse(
                statusCode.success,
                "success",
                "List of Customers",
                customers
            )
            );
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch clinic",
            error
          )
        );
    }  
}


exports.fetchEmployees = async (req,res) =>{
    try {
        const employees = await employeeModel.find();
        return res
            .status(statusCode.success)
            .json(
                returnJsonResponse(
                statusCode.success,
                "success",
                "List of Customers",
                employees
            )
            );
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch clinic",
            error
          )
        );
    }  
}

exports.todayPickup = async (req,res) =>{
    try {

        const date = moment().format('L')
        console.log(date);
        const pickups = await gPickupModel.find({approved: true, date: date});
        console.log("p: ", pickups);
        return res
            .status(statusCode.success)
            .json(
                returnJsonResponse(
                statusCode.success,
                "success",
                "List of Today's Pickup",
                pickups
            )
            );
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch clinic",
            error
          )
        );
    }  
}

exports.getRequestDetails = async (req,res) =>{
    try {
        const requests = await pickupRequestModel.find({approved: false});
        return res
            .status(statusCode.success)
            .json(
                returnJsonResponse(
                statusCode.success,
                "success",
                "List of Customers",
                requests
            )
            );
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch clinic",
            error
          )
        );
    }  
}


exports.approvePickupRequest = async (req,res) =>{
    try {

        const uid = req.params.uid;
        let d = req.params.date;

        let finalDate = d.split("-");
        finalDate = finalDate.join("/");

        const request = await pickupRequestModel.findOne({uid: uid, date: finalDate});

        const updateRequestStatus = await pickupRequestModel.updateOne({uid:uid, date: finalDate}, {
            approved: true
        })

        const data = {
            uid: uid,
            name: request.name,
            phoneno: request.phoneno,
            address: request.address,
            lat: request.lat,
            long: request.long,
            pickup: false,
            approved: true,
            date: request.date
        }

        const addToGarbagePickup = await gPickupModel.create(data);

        //return res.send("success");
        return res.render("approvedPickupRequest", {
          post: {
            name: request.name
          }
        })  //TODO: Create the Page
        // return res
        //     .status(statusCode.success)
        //     .json(
        //         returnJsonResponse(
        //         statusCode.success,
        //         "success",
        //         "Request Data",
        //         request
        //     )
        //     );
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldnt fetch clinic",
            error
          )
        );
    }  
}