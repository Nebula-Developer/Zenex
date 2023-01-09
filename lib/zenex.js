/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

const handling = require('./server/handling');
const http = require('http');
const { ZenexConfig, ZenexApp, ZenexHandler } = require('./types');

/**
 * Zenex app constructor
 * @date 2023-01-09
 * @param {ZenexConfig} params
 * @returns {ZenexApp} app
 */
function zenex(params = new ZenexConfig()) {
    var app = async (req, res) => {
        res.sendFile = (file) => {
            handling.sendFile(file, req, res, params);
        }

        res.sendFileAsync = async (file) => {
            return await handling.sendFileAsync(file, req, res, params);
        }

        for (const handler of app.handlers) {
            // Check if has the 'next' function as an arg
            if (handler.length === 3) {
                var result = await handling.handleCall(handler, req, res);
            } else {
                var result = handler(req, res);
            }

            // If result was true or the request was ended, return
            if (result == true || res.finished) return;
        }

        res.writeHead(404);
        params.errors.notFound ? params.errors.notFound(req, res) : res.end('404 Page Not Found');
    }

    app.handlers = [];

    app.useStatic = (path) => {
        app.handlers.push(handling.zenexStatic(path, params));
    }

    app.use = (handler) => {
        if (typeof handler !== 'function') throw new Error('Handler must be a function');
        app.handlers.push(handler);
    }

    app.http = null;

    app.createServer = () => {
        app.http = http.createServer(app)
        return app.http;
    }

    app.listen = (port = null, callback = null) => {
        if (!app.http) throw new Error('No server created - Did you forget to call app.createServer()?');
        port = port || params.port || 80;
        var host = params.host || 'localhost';
        app.http.listen(port, host, callback);
    }

    return app;
}

module.exports = zenex;