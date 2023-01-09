const zenex = require('zenex');

var app = zenex();
var server = app.createServer();

app.use((req, res, next) => {
    res.sendFileAsync('index.html');
    console.log(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
