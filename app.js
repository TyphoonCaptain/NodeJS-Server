const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');

const usersRoutes = require('./api/routes/users');
const requests_Routes = require('./api/routes/requests');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); // Go to the next middleware
});

// Connect to MongoDB

const dbURL = 'mongodb+srv://tayfun:Tayfun_12340@cluster0.bkdbk9u.mongodb.net/'
const dbName = 'Application_Database'
mongoose.connect(dbURL + dbName, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

mongoose.Promise = global.Promise;

// Routes which should handle requests
app.use('/users', usersRoutes);
app.use('/requests', requests_Routes);

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    // Forward the error request
    next(error);
});

// Error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
        message: error.message
        }
    });
});

module.exports = app;