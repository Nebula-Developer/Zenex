/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

const handling = require('./server/handling');
const http = require('http');
const { ZenexConfig, ZenexApp, ZenexHandler, ZenexServerRequest, ZenexServerResponse, AccountSystemConfig  } = require('./types');
const accounts = require('./accounts/accounts');
const { Socket } = require('net');
const ws = require('ws');
const fs = require('fs');
const { spawn } = require('child_process');
const { Server } = require('http');

/**
 * Zenex app constructor
 * @date 2023-01-09
 * @param {ZenexConfig} params
 * @returns {ZenexApp} app
 */
function zenex(params = new ZenexConfig()) {
    /**
     * Zenex main request handler
     * @param {ZenexServerRequest} req
     * @param {ZenexServerResponse} res
     * @returns 
     */
    var app = async (req, res) => {
        res.sendFile = (file) => {
            handling.sendFile(file, req, res, params);
        }

        res.sendFileAsync = async (file) => {
            return await handling.sendFileAsync(file, req, res, params);
        }

        res.sendJSON = (obj) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(obj));
        }

        res.writeJSON = (obj) => {
            res.write(JSON.stringify(obj));
        }

        for (const handler of app.handlers) {
            // Check if has the 'next' function as an arg
            if (handler.length === 3) {
                var result = await handling.handleCall(handler, req, res);
            } else {
                var result = handler(req, res);
            }

            // If result was true or the request was ended, return
            if (result == true || res.writableEnded) return;
        }

        if (params.useNodeStatic) {
            var nodeStaticOutput = handling.nodeStatic(req, res, params);
            if (nodeStaticOutput == true || res.writableEnded) return;
        }

        res.writeHead(404);
        params.errors?.notFound ? params.errors?.notFound(req, res) : res.end('404 Page Not Found');
        if (!res.writableEnded) res.end();
    }

    app.handlers = [];

    app.useStatic = (path) => {
        app.handlers.push(handling.zenexStatic(path, params));
    }

    app.use = (handler) => {
        if (typeof handler !== 'function') throw new Error('Handler must be a function');
        app.handlers.push(handler);
    }

    /**
     * @type {Server}
     */
    app.http = null;

    app.createServer = () => {
        app.http = http.createServer(app);
        
        app.ws = new ws.Server({
            server: app.http
        });

        return app.http;
    }

    app.listen = (port = null, callback = null) => {
        if (!app.http || !app.ws) throw new Error('No server created - Did you forget to call app.createServer()?');
        port = port || params.port || 80;
        var host = params.host || '127.0.0.1';
        app.http.listen(port, host, callback);

        app.lastListenPort = port;
        app.lastListenCallback = callback;
    }

    app.genAccountSystem = (config) => {
        return accounts.genAccountSystem(app, config);
    }

    app.listenFileChanges = (path) => {
        var watcher = fs.watch(path, (eventType, filename) => {
            if (eventType == 'change') {
                console.log('File changed: ' + filename);
                app.ws.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        type: 'fileChange',
                        path: path,
                        filename: filename
                    }));
                });
                // Restart the process
                spawn(process.argv[0], process.argv.slice(1), {
                    detached: true,
                    stdio: 'inherit'
                }).unref();
                process.exit();
            }
        });
    }

    return app;
}

module.exports = zenex;
