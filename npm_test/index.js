const zenex = require('zenex');
const socketIO = require('socket.io');

var app = zenex();
var server = app.createServer();
var io = socketIO(server);
var accounts = app.genAccountSystem({
    name: 'db'
});

app.useStatic('.');

io.on('connection', (socket) => {
    socket.on('register', (data) => {
        accounts.addAccount({
            username: data.username,
            password: data.password
        });
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
