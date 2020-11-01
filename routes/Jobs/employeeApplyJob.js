'use strict';

var mongo = require("mongodb");

var getData = function(request, response) {
    if(!request.session.user) {
        return response.redirect("/");
   }

    var DB = request.app.locals.DB;

	var jobId = request.params.jobId;

    DB.collection("employerPostJobs").findOne({_id: mongo.ObjectId(jobId)}, function(error, jobPost) {
      
		if(error) {
			return response.send("error fetching job from the DB");
		}

        var data = {
            jobPost: jobPost
        };
   
         return response.render("employee-apply.hbs", data);
    });
}

// Create booking
var postData = function(request, response) {
    var data = {};

    if(!request.session.user) {
        return response.redirect("/");
    } else {
        data.loggedInUser = request.session.user;
    }

    var jobId = request.params.jobId;

    var DB = request.app.locals.DB;
    console.log(request.session.user);

    DB.collection("employerPostJobs").findOne({_id: mongo.ObjectID(jobId)}, function(error, jobPost) {
        if(error) { return response.send("error finding job post"); }

        DB.collection("employeeApply").insertOne({
            jobId: jobId,
            employeeId: request.session.user._id,
            employerId: jobPost.employerId,
            
            employeeName: request.session.user.userName,
            jobTitle: jobPost.jobTitle,
    
            timeOfApply: new Date()
        }, function(error) {    
            if(error) { return response.send("error occurred while applying"); }    
            response.redirect("/employeeDash");    
        }); 
    }); 
}

exports.getData = getData;
exports.postData = postData;