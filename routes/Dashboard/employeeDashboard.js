'use strict';

var mongo = require("mongodb");

var getData = function(request, response) {
    if(!request.session.user) {
        return response.redirect("/");
    }

    var DB = request.app.locals.DB;

    var querysearch = request.query.searchJobs;

    var data = {};
    var employeeId;

    employeeId = request.session.user._id;

    DB.collection("employees").findOne({ _id: mongo.ObjectID(employeeId) }, function (error, employee) {
        if (error) { return response.send("error fetching user data"); }
        data.employee = employee;
    });
    
    DB.collection("employerPostJobs").find({keySkills: {$regex: querysearch}}).toArray(function(error, jobs) { 
        data.jobs = jobs;
        response.render("employeesDashboard.hbs", data);
    });
    
};

exports.getData = getData;