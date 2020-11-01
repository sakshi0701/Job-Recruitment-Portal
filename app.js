"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
const chalk = require('chalk');
var session = require("express-session");
var methodOverride = require('method-override');
var mongoose = require('mongoose');
const path = require('path');
const env = require('dotenv').config();
const nodemailer = require('nodemailer');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//Self modules
var indexPage = require("./routes/Authentication/indexPage.js");
var employerLogin = require("./routes/Authentication/employerLogin.js");
var employerSignup = require("./routes/Authentication/employerSignup.js");
var employeeSignup = require("./routes/Authentication/employeeSignup.js");
var employerDashboard = require("./routes/Dashboard/employerDashboard.js");
var employeeDashboard = require("./routes/Dashboard/employeeDashboard.js");
var employerProfile = require("./routes/Profile/employerProfile.js");
var employeeProfile = require("./routes/Profile/employeeProfile.js");
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
var employerPostJob = require("./routes/Jobs/employerPostJob.js");
var employeeApplyJob = require("./routes/Jobs/employeeApplyJob.js");
var viewProfile = require("./routes/Profile/viewProfile.js");


//create app
var app = express();

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(session({secret: "key" }));

//serve static files
app.use(express.static('public'));

//connect to mongodb
var DB;
var DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/synergy';

mongoose.connect('mongodb://localhost/syn', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

var mongoClient = new mongodb.MongoClient(DB_URL, {useNewUrlParser: true,useUnifiedTopology: true });
mongoClient.connect(function(err) {
    if(err) {
        console.log("Error connecting to MongoDB!");
    } else {
        console.log(chalk.blueBright("Connected to MongoDB database Synergy"));
    }
    DB = mongoClient.db("Synergy");

    app.locals.DB = DB;
});

// routes
app.get("/", indexPage.getData);
app.post("/", indexPage.postData);

app.get("/employerLogin", employerLogin.getData);
app.post("/employerLogin", employerLogin.postData);

app.get("/employerLogout", employerLogin.logout);

app.get("/employeeLogout", indexPage.logout);

app.get("/signUp_employer", employerSignup.getData);
app.post("/signUp_employer", employerSignup.postData)

app.get("/employerDash", employerDashboard.getData);

app.get("/employerProfile", employerProfile.getData);
app.post("/employerProfile", employerProfile.postData);

app.get("/employerPostJob", employerPostJob.getData);
app.post("/employerPostJob", employerPostJob.postData);

app.get("/signupemployee", employeeSignup.getData);
app.post("/signupemployee", employeeSignup.postData);

app.get("/employeeDash", employeeDashboard.getData);
app.get("/employeeDash/:searchJobs", employeeDashboard.getData);

app.get("/employeeProfile", employeeProfile.getData);
app.post("/employeeProfile", employeeProfile.postData);

app.get("/viewProfile/:employeeId", viewProfile.getData);

app.get("/viewProfile", viewProfile.getData);

app.get("/employeeProfileForm", employeeProfile.getFormData);
app.get("/employerProfileForm", employerProfile.getFormData);

app.get("/employeeApply/:jobId", employeeApplyJob.getData);
app.post("/employeeApply/:jobId", employeeApplyJob.postData);

app.get('/search-form',(req,res) => {
  res.sendFile(path.join(__dirname + './employeesDashboard.hbs'));
});



app.get('/employSubscribe',(req,res) => {
  res.sendFile(path.join(__dirname + './employeesDashboard.hbs'));
});

app.post('/employSubscribe', (req,res) =>{
  // console.log("Your message has been sent!");

  "use strict";

async function main() {
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS, 
  }
});

let info = await transporter.sendMail({
  from: req.body.user_mail,
  to: req.body.user_mail, 
  subject: "Hello from Synergy!", 
  text: "Thank you for subsribing our newsletter!", 
});

console.log("Message sent: %s", info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
main().catch(console.error);
});

app.get('/employerposts', async (req, res) => {
    mongoose.connect('mongodb://localhost/posts', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
    app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use('/articles', articleRouter)
const articles = await Article.find().sort({ createdAt: 'desc' })
res.render('articles/index', { articles: articles })
  })

  const contactSchema = new mongoose.Schema({
      email: String,
      msg: String,
    });
  
  const Contact = mongoose.model('Contact', contactSchema);

  app.get('/contact',(req,res) => {
    mongoose.connect('mongodb://localhost/Contact', {useNewUrlParser: true,useUnifiedTopology: true })
    app.use(express.urlencoded())    
    // res.sendFile(path.join(__dirname + './index.hbs'));
  });

  app.post('/contact', (req, res)=>{
    var myData = new Contact(req.body);
    myData.save().then(()=>{
    res.send("Thank You for contacting us!")
    }).catch(()=>{
    res.status(400).send("Item was not saved to the databse")
    });
})

console.log(chalk.greenBright(`App running is running on port 8080`))

app.listen(process.env.PORT || 8080);