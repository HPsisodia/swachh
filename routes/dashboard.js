const express = require('express');
const router = express.Router();

const { protect } = require('./../controllers/authcontroller');


router.get('/dashboard', protect, (req,res) =>{
    
    if(req.user.role === 'employee'){
        console.log(req.user)
        res.render("employee-dashboard", {
            post: {
                name: req.user.name
            }
        });
    }else if(req.user.role === 'admin'){
        res.render("admin-dashboard");
    }else if(req.user.role === 'customer'){
        res.render("customer-dashboard",{
            post: {
                name: req.user.name
            }
        });
    }else{
        res.send(req.user.role);
    }
    
});


module.exports = router;