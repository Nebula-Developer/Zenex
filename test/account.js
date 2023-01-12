const zenex = require('..');

var app = zenex();

var accounts = app.genAccountSystem({
    name: 'test',
    encrypt: false
});

app.createServer();
app.useStatic('test');

console.log(accounts.getAccounts());

console.log(accounts.runForAccounts(accounts.getManyFromObject({
    username: 'test'
}), (account) => {
    console.log("Got", account);
}));
accounts.addAccount({
    username: 'test',
    password: 'test'
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
