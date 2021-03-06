var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');

var index = require('./routes/index');
var login = require('./routes/login');
var fields = require('./routes/fields');
var profile = require('./routes/profile');
var signup = require('./routes/signup');

var app = express();


app.use(session({
    secret: 'ssshhhhh'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
app.use('/fields', fields);
app.use('/profile', profile);
app.use('/signup', signup);
app.use('/favicon.ico', (r, s) => {
    s.send();
});

app.post('/login', login);
app.delete('/login', login);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    res.send();
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.send(err);
});

module.exports = app;