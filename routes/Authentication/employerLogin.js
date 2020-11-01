'use strict';

var getData = function(request, response) {
    return response.render("employerLogin.hbs");
}

var postData = function(request, response) {
    var DB = request.app.locals.DB;

    var userDetails = {
        userName: request.body.email,
        password: request.body.password
    };

    DB.collection("employers").findOne(userDetails, function(error, employer) {
        if(error) {
            return resposnse.send("db error occurred");
        }

        if(!employer) {
            return response.redirect("/employerLogin");
        }

        // Set the session for the user.
        request.session.user = employer;

        response.redirect("/employerDash");
    });
}

var logout = function(request, response) {
    request.session.user = null;
    response.redirect("/employerLogin");
}

exports.getData = getData;
exports.postData = postData;
exports.logout = logout;