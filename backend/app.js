var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonServer = require('json-server');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var seatListRouter = require('./routes/seatList');

var app = express();
var cors = require('cors');
app.use(cors());


const http = require('http')
const socketIO = require('socket.io')
const socketPort = 3001
const server = http.createServer(app)
const io = socketIO(server)
io.on('connection', socket => {
    console.log('New client connected')
    socket.on('seat changed', (seatID, userID) => {
        io.sockets.emit('seat changed', seatID, userID)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})
server.listen(socketPort, () => console.log(`SocketIO Listening on port ${socketPort}`))


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