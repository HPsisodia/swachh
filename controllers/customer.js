const customerModel = require('./../models/customer');
const gPickupModel = require('./../models/garbagepickup');
const pickRequestModel = require('./../models/pickuprequest');
const axios = require('axios');
const qr = require("qrcode");

require("dotenv").config();

const {
    statusCode,
    returnErrorJsonResponse,
    returnJsonResponse,
  } = require("../Helpers/status.js");

exports.registerCustomer = async (req,res) =>{
    try {
        
        const uid = req.user.uid;

        const dataExist = await customerModel.findOne({uid: uid});

        if(dataExist && dataExist.registered == true){
          //return res.send("Already Registered");
          return res.render("alreadyRegistered")  //TODO: Create this Page
        }
 

        const { name, email, phoneno, address } = req.body;
        const add = address.toLowerCase().split(' ').join('+');

        console.log(add);
        const response = await axios({
			  url: `https://maps.googleapis.com/maps/api/geocode/json?address=${add}&components=country:IN&key=${process.env.GEO_LOCATION}`,
			  method: "get",
		    });

        

        const location = response.data.results[0].geometry.location
        const lat = location.lat;
        const long = location.lng;


        const data = {
            uid: uid,
            name: name,
            email: email,
            phoneno: phoneno,
            address: address,
            "coordinates.lat": lat,
            "coordinates.long": long,
        }
        
        if(!dataExist){
          const customer = await customerModel.create(data);
        }else if (dataExist && dataExist.registered == false){
          const updateCustomer = await customerModel.updateOne({uid: uid}, {
            name: name,
            email: email,
            phoneno: phoneno,
            address: address,
            "coordinates.lat": lat,
            "coordinates.long": long,
          })
        }
        
        //return res.send("Success")
        //{"Access-Control-Allow-Origin": "*",  
        //"Content-Security-Policy": "default-src *; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com 'unsafe-inline' 'unsafe-eval'; object-src 'self'"}
        
        return res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
               .render("confirmLocation",{
                  post: {
                    api_key: process.env.GEO_LOCATION,
                    lat: lat,
                    long: long,
                }
      });   
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

exports.updateCoordinates = async (req,res) => {
    try {

        const uid = req.user.uid;

        
        const { lat, long } = req.body;
        const updatedCoordinates = await customerModel.updateOne({uid: uid}, {
          "coordinates.lat": lat,
          "coordinates.long": long,
          registered: true
        });

        //return res.send("success");
        return res.render("updatedCoordinates"); // TODO: CREATE THIS PAGE       
    } catch (error) {
        return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Something went wrong, Couldn't update location",
            error
          )
        );        
    }        
}

exports.pickupRequest = async (req,res) =>{
  try {

      const uid = req.user.uid;
      const { reason, date} = req.body;

      const d = date.split('-');

      const finalDate = d[1] + "/" + d[2] + "/" + d[0];

      const customerData = await customerModel.findOne({uid: uid});

      const data = {
        uid: uid,
        name: customerData.name,
        phoneno: customerData.phoneno,
        address: customerData.address,
        lat: customerData.coordinates.lat,
        long: customerData.coordinates.long,
        reason: reason,
        date: finalDate
      }


      const pickups = await pickRequestModel.create(data)

      //return res.send("success");
      return res.render("appliedForPickup")  //TODO: Create this Page
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


exports.generateQR = async (req,res) =>{
  try {

      const uid = req.user.uid;
      let date = moment().format('L');

      let finaDate = date.split("/").join("-");

      const url = `http://localhost:3000/verify/qr/${uid}/${finalDate}`

      qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");
      
        // Let us return the QR code image as our response and set it to be the source used in the webpage
        res.render("scan", { src });
      });

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