const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const helmet = require("helmet");
const cookieParser = require('cookie-parser')
const cron = require('node-cron');
const moment = require('moment');

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const gPickupModel = require('./models/garbagepickup');
const customerModel = require('./models/customer');

global.appRoot = path.resolve(__dirname);

// Logs Cache controlling Https

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "*"}));
app.use(helmet());
app.use(cookieParser())

// const static_path = path.join(__dirname, '/public/images');
// console.log(__dirname, '/views/images');
app.use(express.static('public'));
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");

const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const customerRoute = require('./routes/customer');
const driverRoute = require('./routes/driver');
const dashboardRoute = require('./routes/dashboard');

app.use("/", authRoute);
app.use("/", adminRoute);
app.use("/", customerRoute);
app.use("/", driverRoute);
app.use("/", dashboardRoute);


const writeToDB = async () => {
  try{
    const allCustomerData = await customerModel.find({registered: true});
    let data = [];
  
    for(let i = 0; i<allCustomerData.length; i++){
      let customer = {
        uid: allCustomerData[i].uid,
        name: allCustomerData[i].name,
        phoneno: allCustomerData[i].phoneno,
        address: allCustomerData[i].address,
        lat: allCustomerData[i].coordinates.lat,
        long: allCustomerData[i].coordinates.long,
        pickup: false,
        approved: true,
        date: moment().format('L')
      }
  
      data.push(customer);
    }

    //console.log(data);
    
    const insertCustomer = await gPickupModel.insertMany(data);

    return data;
  }catch(error){
    console.log(error);
  }  
  
}



//0 06 * * 1,3,5,7

//Cron Job
//cron won’t start automatically
var task = cron.schedule('0 06 * * 1,3,5,6,7', () => {
  writeToDB();
  // client.messages
  // .create({
  //    body: 'Test Message from Twilio',
  //    from: '+19854668290',
  //    to: '+919953838406'
  //  })
  // .then(message => console.log(message.sid));
}, 
{
  scheduled: false,
  timezone: "Asia/Kolkata"
});

// start method is called to start the above defined cron job
task.start();

// var task = cron.schedule('*/2 * * * *', async () => {
//   //console.log("Current Date: ", moment().format('L'));
//   console.log("here");
//   const data = await writeToDB();
//   console.log("DB Data: ", data)
//   await client.messages
//   .create({
//      body: 'Test Message 2 from Twilio. Check this 2',
//      from: '+19854668290',
//      to: '+919685600830'
//    })
//   .then(message => console.log(message.sid));
// });

// task.start();

const PORT = process.env.PORT || 3000;
const DBURL = process.env.DBURL ////add mongo database URI here

mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Application is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });  
