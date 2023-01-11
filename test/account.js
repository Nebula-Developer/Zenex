const zenex = require('..');


var app = zenex();

var sys = app.genAccountSystem({
    name: 'test'
});

app.createServer();

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
