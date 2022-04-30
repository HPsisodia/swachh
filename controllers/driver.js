const gPickupModel = require('./../models/garbagepickup');
const employeeModel = require('../models/employee');
const axios = require('axios');
const moment = require('moment');
const open = require('open');

require("dotenv").config();

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");

const { location } = require('../Helpers/wasteProcessingLocation');  

exports.getRoute = async (req,res) => {
    try {

        const date = moment().format('L');
        const pickupData = await gPickupModel.find({pickup: false, date: date, approved: true});

        if(pickupData.length == 0){
          return res.render("noPickupToday");
        }

        let coordinateString = '';

        for(let i = 0; i<pickupData.length; i++){
          coordinateString += pickupData[i].lat + ',' + pickupData[i].long + '|'
        }

        console.log("String", coordinateString);

        open(`https://www.google.com/maps/dir/?api=1&origin=${location.start}&destination=${location.end}&travelmode=driving&waypoints=optimize:true|stopover:true|${coordinateString}`)
        // return (async () => {
        //   const browser = await puppeteer.launch({headless: false});
        //   const page = await browser.newPage();
        //   await page.goto(`https://www.google.com/maps/dir/?api=1&origin=${location.start}&destination=${location.end}&travelmode=driving&waypoints=optimize:true|stopover:true|${coordinateString}`);
        
        //   await browser.close();
        // })();


        //res.redirect(`https://www.google.com/maps/dir/?api=1&origin=${location.start}&destination=${location.end}&travelmode=driving&waypoints=optimize:true|stopover:true|${coordinateString}`)
      //   return res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
      //           .render("direction",{
      //             post: {
      //               api_key: process.env.GEO_LOCATION,
      //           }
      // });
        res.status(statusCode.success)
        return;
                    
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


exports.registerDriver = async (req,res) =>{
  try {
      
      const uid = req.user.uid;

      const dataExist = await employeeModel.findOne({uid: uid});

      if(dataExist){
        //return res.send("Already Registered");
        return res.render("alreadyRegistered")  //TODO: Create this Page
      }


      const { name, email, phoneno, address, designation } = req.body;


      const data = {
          uid: uid,
          name: name,
          email: email,
          phoneno: phoneno,
          address: address,
          designation: designation
      }
      
      if(!dataExist){
        const driver = await employeeModel.create(data);
      }
      
      return res.send("Successfully Registered");
      return res.render("driverRegistered");   //TODO: CREATE PAGE
  } catch (error) {
      return res
      .status(statusCode.bad)
      .json(
        returnErrorJsonResponse(
          statusCode.bad,
          "fail",
          "Something went wrong, Please try again. Check internet connection",
          error
        )
      );        
  }
  
}


exports.updatePickupStatus = async (req,res) =>{
  try {

      const uid = req.params.uid;
      const date = req.params.date
      const updateStatus = await gPickupModel.updateOne({uid: uid, date: date}, {
        pickup: true
      })

      //return res.send("success");

      return res.render("updatedPickupStatus")  //TODO: Create The Page
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