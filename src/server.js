// use the express library
const express = require('express');
// create a new server application
const app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;
let nextVisitorId = 1;

// Function to calculate for how long you have been here
function dateTimeFunction(lastAccessedTime) {
    var timeOnSite = Date.now() - lastAccessedTime;
    var totalTime = timeOnSite / 1000;
    var timeInSeconds = Math.floor(totalTime);
    return timeInSeconds;
}

// The main page of our website
app.get('/', (req, res) => {

    if (isNaN(req.cookies['visitorId'])) {
        nextVisitorId++;
    }

    res.cookie('visitorId', nextVisitorId)

    // To check for first time
    var output = "";
    if (isNaN(dateTimeFunction(req.cookies['visited']))) {
        output = "Welcome to this website";
    } else {
        var time = dateTimeFunction(req.cookies['visited']);
        if (time < 60) {
            output = "It has been " + time + " seconds since your last visit";
        } else {
            output = "It has been " + Math.floor((time % 3600) / 60) + " minutes since your last visit";
        }
    }

    res.cookie('visited', Date.now().toString());
    res.render('welcome', {
        name: req.query.name || "World",
        last_accessed: new Date().toLocaleString() || "10/09/2022, 00:00:00 PM",
        visitedNo: `${output}`,
        visitorId: req.cookies['visitorId'] || nextVisitorId
    });

    console.log(req.headers.cookie);
});

app.use(express.static('public'));

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");