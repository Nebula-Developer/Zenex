const fs = require('fs');
const path = require('path');
const { ZenexConfig } = require('../types');
const mimetypes = require('./mimetypes');
const types = require('../types');

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
        var file = path.join(p, req.url);
        if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
            if (params.disableStaticIndex !== true && fs.existsSync(path.join(file, 'index.html')))
                file = path.join(file, 'index.html');
            else return false;
        }

        res.writeHead(200, {
            'Content-Type': mimetypes[path.extname(file).slice(1)] || 'text/plain'
        });

        var stream = fs.createReadStream(file);
        stream.pipe(res);
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
        var stream = fs.createReadStream(f);
        stream.pipe(res);
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
        res.end(fs.readFileSync(f));
    } else {
        res.writeHead(404);
        params.errors.notFound ? params.errors.notFound(req, res) : res.end('404 Page Not Found');
    }
}

module.exports = {
    handleCall,
    zenexStatic,
    sendFile,
    sendFileAsync
};
