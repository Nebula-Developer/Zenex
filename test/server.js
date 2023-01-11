const zenex = require('..');
const { ZenexHandler } = require('../lib/types');

var app = zenex({
    errors: {
        notFound: (req, res) => {
            res.writeHead(404);
            res.end('404 Page Not Found');
        }
    }
});

var server = app.createServer();

// app.useStatic('test');

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    res.sendJSON({
        hello: 'world',
        foo: 'bar'
    });

    res.end();
    next();
});

var sys = app.genAccountSystem({
    name: 'test2'
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
