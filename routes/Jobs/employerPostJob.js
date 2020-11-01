'use strict';

var getData = function(request, response) {
    if(!request.session.user) {
        return response.redirect("/employerLogin");
    }
   return response.render("employerPostJob.hbs");
}

var postData = function(request, response) {
    var DB = request.app.locals.DB;

    var jobTitle = request.body.jobTitle;
    var jobDescription = request.body.jobDescription;
    var keySkills = request.body.keySkills.toLowerCase();
    var location = request.body.location;
    var desiredCandidates = request.body.desiredCandidates;
    var orgProfile = request.body.organizationProfile;
    var employerId = request.session.user._id;

    var data = {
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        keySkills: keySkills,
        location: location,
        desiredCandidates: desiredCandidates,
        orgProfile: orgProfile,
        employerId : employerId
    }

    DB.collection("employerPostJobs").insertOne(data, function(error, result){
        if(error){
            return response.send("Error occured while inserting data to DB");
        }
        return response.redirect("/employerDash");
    })
}

exports.getData = getData;
exports.postData = postData;