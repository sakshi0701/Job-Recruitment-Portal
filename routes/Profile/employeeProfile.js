'use strict';
var multiparty = require("multiparty");
var path = require("path");
var mongo = require("mongodb");
var cloudinary = require("cloudinary").v2;


var getData = function (request, response) {
    if (!request.session.user) {
        return response.redirect("/");
    }

    var DB = request.app.locals.DB;

    var data = {};
    var employeeId;


    if (request.query.employeeId) {
        employeeId = request.query.employeeId;

    } else {
        employeeId = request.session.user._id;
    }

    DB.collection("employees").findOne({ _id: mongo.ObjectID(employeeId) }, function (error, employee) {
        if (error) { return response.send("error fetching user data"); }
        data.employee = employee;
        return response.render("employeeProfile.hbs", data);
    });
}

var getFormData = function (request, response) {
    response.render("employeeProfileForm.hbs");
}

var postData = function (request, response) {
    var DB = request.app.locals.DB;

    var form = new multiparty.Form();

    form.parse(request, function (error, fields, files) {
        var name = fields.name;
        var keySkills = fields.keySkills;
        var education = fields.education;
        var summary = fields.summary;
        var experience = fields.experience;
        var itSkills = fields.itSkills;
        var projects = fields.projects;
        var imagePath = files.photo[0].path;
        var resumePath = files.resume[0].path;
        var imageName = path.basename(imagePath);
        var resumeName = path.basename(resumePath);

        var createdBy = request.session.user._id;

        var data = {
            name: name,
            keySkills: keySkills,
            education: education,
            summary: summary,
            experience: experience,
            itSkills: itSkills,
            projects: projects,
            imagePath: imagePath,
            imageName: imageName,
            resumePath: resumePath,
            resumeName: resumeName,
            createdBy: createdBy
        };


        cloudinary.uploader.upload(imagePath, { resource_type: "auto" }, function (error, imageUploaded) {
            if (error) {
                console.log(error);
                return response.send("error uploading");
            }

            // Using cloudinary uploaded URL for profile picture.
            data.imagePath = imageUploaded.secure_url;

            cloudinary.uploader.upload(resumePath, { resource_type: "auto" }, function (error, resumeUploaded) {
                if (error) {
                    console.log(error);
                    return response.send("error uploading");
                }

                // Using cloudinary uploaded URL for the resume.
                data.resumePath = resumeUploaded.secure_url;

                // Update the employee profile
                var employeeId = request.session.user._id;
                DB.collection("employees").update({ _id: mongo.ObjectID(employeeId) }, { $set: data }, function (error) {
                    if (error) { return response.send("error updating profile."); }
                    return response.redirect("/employeeProfile");
                });
            }); 
        });
    }); 
} 

exports.getData = getData;
exports.getFormData = getFormData;
exports.postData = postData;