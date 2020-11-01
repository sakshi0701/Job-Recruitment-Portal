'use strict';

var mongo = require("mongodb");

var getData = function(request, response) {
    if(!request.session.user) {
        return response.redirect("/employerLogin");
    }

    var data = {};

    var DB = request.app.locals.DB;

    var employeeId = request.params.employeeId;

    if (request.query.employeeId) {
        employeeId = request.query.employeeId;

    } else {
        employeeId = request.session.user._id;
    }       

        DB.collection("employees").findOne({_id:mongo.ObjectId(employeeId)}, function(error, employee) {
            if(error) {
                return response.send("Error fetching Data");
            }
            data.employees = employee;
            console.log(data);
            return response.render("viewProfile.hbs", data);
        })
}

exports.getData = getData;