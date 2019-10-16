var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonServer = require('json-server');

var app = express();
var cors = require('cors');
app.use(cors());


const http = require('http')
const socketIO = require('socket.io')
const socketPort = 3001
const server = http.createServer(app)
const io = socketIO(server)

let onlineUserNum = 0;
io.on('connection', socket => {
    console.log('New client connected')
    io.sockets.emit('online users', onlineUserNum += 1);

    socket.on('seat changed', (seatID, userID) => {
        io.sockets.emit('seat changed', seatID, userID)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
        io.sockets.emit('online users', onlineUserNum -= 1);
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

app.use('/api', jsonServer.router('db.json'));

module.exports = app;