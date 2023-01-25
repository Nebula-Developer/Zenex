/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

const fs = require('fs');
const path = require('path');
const { ZenexConfig, ZenexServerRequest, ZenexServerResponse } = require('../types');
const mimetypes = require('./mimetypes');
const types = require('../types');
const zFileHandle = require('./filehandle');
const http = require('http');

function handleCall(handler, req, res) {
    return new Promise((resolve, reject) => {
        handler(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

var cache = {};

/**
 * Generate static file handler
 * @date 2023-01-09
 * @param {string} p
 * @param {ZenexConfig} params
 * @returns {function} handler
 */
function zenexStatic(p, params) {
    if (params.disableStaticPathResolve !== true)
        p = path.resolve(p);
    
    return (req, res) => {
        var start = Date.now();
        var file = path.join(p, req.url);
        
        if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
            if (params.disableStaticIndex !== true && fs.existsSync(path.join(file, 'index.html')))
                file = path.join(file, 'index.html');
            else return false;
        }     

        res.writeHead(200, {
            'Content-Type': mimetypes[path.extname(file).slice(1)] || 'text/plain'
        });

        // If has cache and the file hasn't been modified
        if (cache[file] && cache[file].mtime === fs.statSync(file).mtime.getTime()) {
            res.end(zenexFileHandler(cache[file].data, file, false));
            var end = Date.now();
            console.log(`Served ${file} in ${end - start}ms (cached)`);
            return true;
        }

        var startStream = Date.now();

        var stream = fs.createReadStream(file)
            .on('data', (chunk) => {
                res.write(zenexFileHandler(chunk, file));
            })
            .on('end', () => {
                res.end();
                var end = Date.now();
                console.log(`Served ${file} in ${end - start}ms (stream: ${end - startStream}ms)`);
            });

        return true;
    }
}

/**
 * Send a file to a response
 * @date 2023-01-09
 * @param {string} file
 * @param {types.ZenexServerRequest} req
 * @param {types.ZenexServerResponse} res
 * @param {ZenexConfig} params
 */
function sendFile(file, req, res, params) {
    var f = path.join(path.resolve('.'), file);
    if (fs.existsSync(f) && fs.lstatSync(f).isFile()) {
        res.writeHead(200, {
            'Content-Type': mimetypes[path.extname(f).slice(1)] || 'text/plain'
        });
        var stream = fs.createReadStream(f)
            .on('data', (chunk) => {
                res.write(zenexFileHandler(chunk, f));
            })
            .on('end', () => {
                res.end();
            });

    } else {
        res.writeHead(404);
        params.errors.notFound ? params.errors.notFound(req, res) : res.end('404 Page Not Found');
    }
}

/**
 * Send a file to a response asynchronously
 * @date 2023-01-09
 * @param {string} file
 * @param {types.ZenexServerRequest} req
 * @param {types.ZenexServerResponse} res
 * @param {ZenexConfig} params
 * @returns {Promise<void>}
 */
async function sendFileAsync(file, req, res, params) {
    var f = path.join(path.resolve('.'), file);
    if (fs.existsSync(f) && fs.lstatSync(f).isFile()) {
        res.writeHead(200, {
            'Content-Type': mimetypes[path.extname(f).slice(1)] || 'text/plain'
        });
        res.end(zenexFileHandler(fs.readFileSync(f), f));
    } else {
        res.writeHead(404);
        params.errors.notFound ? params.errors.notFound(req, res) : res.end('404 Page Not Found');
    }
}

/**
 * Primary Zenex file piped handler
 * @date 2023-01-09
 * @param {Buffer} stream
 */
function zenexFileHandler(stream, file, shouldCache = true) {
    var ext = path.extname(file).slice(1);
    var rawStream = stream;
    if (ext == 'html') stream = zFileHandle.html(stream);
    else if (ext == 'css') stream = zFileHandle.css(stream);
    else if (ext == 'js') stream = zFileHandle.js(stream);
    
    if (shouldCache) {
        cache[file] = {
            data: rawStream,
            mtime: fs.statSync(file).mtime.getTime()
        };
    }

    return stream;
}

/**
 * Handle node_modules as a static path
 * @date 2023-01-09
 * @param {ZenexServerRequest} req
 * @param {ZenexServerResponse} res
 * @param {ZenexConfig} params
 */
function nodeStatic(req, res, params) {
    if (res.writableEnded) return false;
    var returning = zenexStatic(path.join(path.resolve('.'), 'node_modules'), params)(req, res);
    return returning;
}

module.exports = {
    handleCall,
    zenexStatic,
    sendFile,
    sendFileAsync,
    nodeStatic
};
