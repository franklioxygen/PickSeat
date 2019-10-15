var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonServer = require('json-server')


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var seatListRouter = require('./routes/seatList');

var app = express();
var cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/seatList', seatListRouter);
app.use('/api', jsonServer.router('db.json'));

module.exports = app;