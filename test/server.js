const zenex = require('..');

var app = zenex({
    errors: {
        notFound: (req, res) => {
            res.writeHead(404);
            res.end('404 Page Not Found');
        }
    }
});

var server = app.createServer();

app.useStatic('.');

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
