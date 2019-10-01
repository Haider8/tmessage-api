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

app.post('/api/user/register', async (req, res) => {
    try {
        await auth.register(req.body);
        return res.json({success: true, message: `User [${req.body.userName}] successfully registered`});
    } catch(e) {
        return res.status(400).json({success: false, message: e.message});
    }
});

app.post('/api/user/login', async (req, res) => {
    try {
        await auth.login(req.body);
        return res.json({success: true, message: `User [${req.body.userName}] succesfully logged in`});
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