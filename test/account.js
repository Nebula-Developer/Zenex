const zenex = require('..');

var app = zenex();

var accounts = app.genAccountSystem({
    name: 'test',
    encrypt: true
});

app.createServer();
app.useStatic('test');

console.log(accounts.genKey())

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
