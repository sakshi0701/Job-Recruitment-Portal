'use strict';

var multiparty = require("multiparty");
var path = require("path");
var mongo = require("mongodb");
var cloudinary = require("cloudinary").v2;

var getData = function(request, response) {
    if(!request.session.user) {
        return response.redirect("/employerLogin");
    }

    var DB = request.app.locals.DB;

    var data = {};
    var employerId;


    if (request.query.employerId) {
        employerId = request.query.employerId;

    } else {
        employerId = request.session.user._id;
    }

    DB.collection("employers").findOne({ _id: mongo.ObjectID(employerId) }, function (error, employer) {
        if (error) { return response.send("error fetching user data"); }
        data.employer = employer;
        return response.render("employerProfile.hbs", data);
    });
}

var getFormData = function (request, response) {
    response.render("employerProfileForm.hbs");
}

var postData = function(request, response) {
    var DB = request.app.locals.DB;

   var form = new multiparty.Form();

   form.parse(request, function(error, fields, files){

        var imagePath = files.photo[0].path;
        var imageName = path.basename(imagePath);
        var createdBy = request.session.user._id;

        var data = {
            name: fields.name,
            mail: fields.mailId,
            designation: fields.designation,
            organization: fields.organization,
            phoneNumber: fields.phoneNumber,
            summary: fields.summary,
            inlineRadioOptions: fields.inlineRadioOptions,
            imagePath: imagePath,
            imageName: imageName,
            createdBy: createdBy
        };

        cloudinary.uploader.upload(imagePath, { resource_type: "auto" }, function (error, imageUploaded) {
            if (error) {
                console.log(error);
                return response.send("error uploading");
            }

            // Use cloudinary uploaded URL for profile picture.
            data.imagePath = imageUploaded.secure_url;

            // Update the employee profile
            var employerId = request.session.user._id;
            DB.collection("employers").update({ _id: mongo.ObjectID(employerId) }, { $set: data }, function (error) {
                if (error) { return response.send("error updating profile."); }
                return response.redirect("/employerProfile");
            }); 

        }); 

    }); 
}

exports.getData = getData;
exports.getFormData = getFormData;
exports.postData = postData;