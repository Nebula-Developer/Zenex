const zenex = require('..');
const { ZenexHandler } = require('../lib/types');

var app = zenex({
    useNodeStatic: true
});

var server = app.createServer();

// app.useStatic('test');

app.useStatic('test');
app.listenFileChanges('test');

app.listen(3000, () => {
    console.log('Listening on port 3000!...');
});
