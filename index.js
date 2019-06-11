const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const User = require("./models/user");
const City = require("./models/cities");
const bCrypt = require('bcrypt-nodejs');
const cookieParser = require('cookie-parser');

const port = 8080;
const app = express();

app.use(
    expressSession({
        secret: "mySecretKey",
        saveUninitialized: true,
        resave: true
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(require("connect-flash")());
app.use(function(req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

//DataBase Connection
mongoose.connect("mongodb://localhost/imd-weather-station", {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("connected to database");
});
//

//Initializing passport
var initPassport = require('./passport/init');
initPassport(passport);
//

//
var getDate = function() {
        n = new Date();
        y = n.getFullYear();
        m = n.getMonth() + 1;
        d = n.getDate();
        var date = y + '-' + m + '-' + d;
        return date;
    }
    //


//Routes
app.get("/", function(req, res) {
    City.findOne({
        city: "Mumbai"
    }, function(err, defCity) {
        if (!defCity) {
            res.redirect('/error');
        } else {
            City.findOne({
                city: "Mumbai",
                date: getDate()
            }, function(err, finalCity) {
                if (!finalCity) {
                    finalCity = null;
                }
                res.render('default', finalCity);
            });

        }
    });
});

app.get("/login", function(req, res) {
    if (req.user) return res.redirect('/');
    res.render("loginPage", {
        error: req.query.error
    });
});

app.post(
    "/login",
    passport.authenticate('login', {
        failureFlash: "Invalid Username or Password.",
        successFlash: "Login Successful",
        successRedirect: "/",
        failureRedirect: "/login?error=Login Failed"
    })
);

app.get("/registerCity", function(req, res) {
    if (!req.user) return res.redirect('noPerm');
    else if (req.user.authority != 2) return res.redirect('noPerm');
    else return res.render('citySignup');
});

app.post("/registerCity", function(req, res) {
    // var cityData = {
    //     username: req.body.cityName,
    //     password: req.body.cityPwd
    // };
    if (!req.user) return res.redirect('noPerm');
    else if (req.user.authority != 2) return res.redirect('noPerm');
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
    var user = new User({
        username: req.body.cityName,
        password: createHash(req.body.cityPwd),
        authority: 1
    });
    user.save(function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/registerCity')
        } else {
            return res.redirect('/');
        }
    });
});

app.get("/updateData", function(req, res) {
    if (!req.user) return res.redirect('noPerm');
    else if (req.user.authority != 1) return res.redirect('noPerm');
    res.render('todayData', {
        city: req.user.username
    });
});

app.post("/updateData", function(req, res) {
    if (!req.user) return res.redirect('noPerm');
    else if (req.user.authority != 1) return res.redirect('noPerm');
    var newCity = new City({
        city: req.body.cityName,
        date: req.body.date,
        minTemp: req.body.minTemp,
        maxTemp: req.body.maxTemp,
        humidity: req.body.humidity,
        pressure: req.body.pressure,
        windSpeed: req.body.windSpeed,
        windDirection: req.body.windDirection,
        weatherType: req.body.weatherType
    });
    newCity.save(function(err, newCity) {
        if (err) {
            console.log(err);
            return res.redirect('/updateData');
        } else {
            return res.redirect('/');
        }
    })
});

app.get("/error", function(req, res) {
    res.render('404error');
});


app.get('/noPerm', function(req, res) {
    res.render('noPermission');
});

app.post('/handleCity', function(req, res) {
    var cityName = req.body.inputCity;
    res.redirect('/' + cityName);
});

app.get('/needHelp', function(req, res) {
    res.render('needHelpPage');
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/:city', function(req, res) {
    var cityName = req.params.city;
    City.findOne({
        city: cityName
    }, function(err, defCity) {
        if (!defCity) {
            res.redirect('/error');
        } else {
            City.findOne({
                city: cityName,
                date: getDate()
            }, function(err, finalCity) {
                console.log(finalCity);
                if (!finalCity) {
                    finalCity = null;
                }
                res.render('default', finalCity);
            });

        }
    });
});

app.get('/:city/:date', function(req, res) {
    var cityName = req.params.city;
    var dateVal = req.params.date;
    City.findOne({
        city: cityName,
        date: dateVal
    }, function(err, defCity) {
        console.log(defCity);
        if (!defCity) {
            res.redirect('/error');
        } else {
            res.render('default', defCity);
        }
    })
});
//

app.listen(port, function() {
    console.log("Listening on port" + port);
});