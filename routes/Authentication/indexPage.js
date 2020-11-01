'use strict';

var getData = function(request, response) {
    response.render("index.hbs");
}

var postData = function(request, response) {
    var DB = request.app.locals.DB;

    var userDetails = {
        userName: request.body.email,
        password: request.body.password
    };

    DB.collection("employees").findOne(userDetails, function(error, employee) {
        if(error) {
            return resposnse.send("db error occurred");
        }

        if(!employee) {
            return response.redirect("/");
        }
        request.session.user = employee;
        response.redirect("/employeeDash");
    });
}

var logout = function(request, response) {
    request.session.user = null;
    response.redirect("/");
}

exports.getData = getData;
exports.postData = postData;
exports.logout = logout;