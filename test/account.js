const zenex = require('..');
const fs = require('fs');

var app = zenex();

var accounts = app.genAccountSystem({
    name: 'test',
    encrypt: false
});

app.createServer();
app.useStatic('test');


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
