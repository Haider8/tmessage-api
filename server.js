// Express
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// dotenv - support Enviroment Variable
require('dotenv').config();

// Cross-Origin Resource Sharing enabled
const cors = require('cors');
app.use(cors());

// Enable req.body
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// auth module
const auth = require('./auth-manager')();
const mongoDBConnectionString = process.env.MONGODB_CONNECTION_STRING;

// Security with JWT
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;
jwtOptions.passReqToCallback = true;

var strategy = new JwtStrategy(jwtOptions, function (req, jwt_payload, next) {
    if (jwt_payload) {
        next(null, jwt_payload);
    } else {
        next(null, false);
    }
});

passport.use(strategy);
app.use(passport.initialize());

// Add this middleware to routes need protected
const basicTokenAuthentication = passport.authenticate("jwt", {session: false});

app.post('/api/user/register', async (req, res) => {
    try {
        let user = await auth.register(req.body);
        let { userName, displayedName } = user;
        let jwt_payload = { userName, displayedName };
        let token = jwt.sign(jwt_payload, jwtOptions.secretOrKey);
        return res.json({success: true, token, message: `User [${req.body.userName}] successfully registered`});
    } catch(e) {
        return res.status(400).json({success: false, message: e.message});
    }
});

app.post('/api/user/login', async (req, res) => {
    try {
        let user = await auth.login(req.body);
        let { userName, displayedName } = user;
        let jwt_payload = { userName, displayedName };
        let token = jwt.sign(jwt_payload, jwtOptions.secretOrKey);
        return res.json({success: true, token, message: `User [${req.body.userName}] succesfully logged in`});
    } catch(e) {
        return res.status(400).json({success: false, message: e.message});
    }
});

app.get('/api/user/checkExist/:userName', async (req, res) => {
    try {
        let userName = req.params.userName;
        let userNameExist = await auth.checkExist(userName);
        if (userNameExist) {
            return res.json({success: true, exist: true, message: `User [${userName}] has already existed`});
        } else {
            return res.json({success: true, exist: false, message: `User [${userName}] does not exist`});
        }
    } catch(e) {
        return res.status(400).json({success: false, message: e.message})
    }
});

auth.initialize(mongoDBConnectionString)
.then(db => app.listen(HTTP_PORT, _ => console.log(`tmessage API is listening on port [${HTTP_PORT}]`)))
.catch(err => console.log(`Unable to start the server: ${err.message}`))