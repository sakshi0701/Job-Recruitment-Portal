'use strict';
var mongo = require("mongodb");

var getData = function(request, response) {
    var data = {};
    
    if(!request.session.user) {
        return response.redirect("/employerLogin");
    } else {
        data.loggedInUser = request.session.user;
    }
    
    var DB = request.app.locals.DB;

    DB.collection("employerPostJobs").find({employerId:request.session.user._id}).toArray(function(error, allPosts) {
        if(error) {return response.send("error fetching data"); }

        data.allPosts = allPosts;

        DB.collection("employeeApply").find({employerId:request.session.user._id}).toArray(function(error, employees) {
            if(error) {return response.send("error fetching data");}

            data.employees = employees;

            console.log(employees);
            return response.render("employerDash.hbs", data);
        });
    });

 }

exports.getData = getData;