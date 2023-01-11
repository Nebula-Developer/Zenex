/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

const http = require('http');

class ZenexConfig {
    errors = {
        /**
         * Handler called upon a 404 error (not found)
         * @param {ZenexServerRequest} req
         * @param {ZenexServerResponse} res
         */
        notFound: (req, res) => {},

        /**
         * Handler called upon a 500 error (server/internal error)
         * @param {ZenexServerRequest} req
         * @param {ZenexServerResponse} res
         */
        serverError: (req, res) => {}
    };

    /**
     * Port to listen on
     */
    port = 80;

    /**
     * Host to listen on
     */
    host = 'localhost';

    /**
     * Whether to disable static directories falling back on 'dir/' with 'dir/index.html'
     */
    disableStaticIndex = false;

    /**
     * Whether to resolve static paths with the 'path.resolve' function
     */
    disableStaticPathResolve = false;
}

/**
 * Zenex app
 * @date 2023-01-09
 * @typedef {function} ZenexApp
 * @param {ZenexServerRequest} req
 * @param {ZenexServerResponse} res
 * @returns {Promise} promise
 * @returns {boolean} result
 */
class ZenexApp {
    constructor() {
        this.handlers = [];
        this.http = null;
    }

    /**
     * Handler array called upon request
     * @date 2023-01-09
     */
    handlers = [];

    /**
     * Add a static path
     * @date 2023-01-09
     * @param {string} path
     */
    useStatic = (path) => {};

    /**
     * Use a handler
     * @date 2023-01-09
     * @param {ZenexHandler} handler
     */
    use = (handler) => {};

    /**
     * HTTP server
     * @date 2023-01-09
     * @type {http.Server}
     * @returns {http.Server}
     */
    http = null;

    /**
     * Create an HTTP server
     * @date 2023-01-09
     * @returns {http.Server}
     */
    createServer = () => {};

    /**
     * Listen on a port
     * @date 2023-01-09
     * @param {number} port
     * @param {function} callback
     */
    listen = (port, callback) => {};
}

/**
 * Zenex handler
 * @date 2023-01-09
 * @callback ZenexHandler
 * @param {ZenexServerRequest} req
 * @param {ZenexServerResponse} res
 * @param {function} next
 * @returns {boolean} result
 * @returns {Promise} promise
 */
const ZenexHandler = (req, res, next) => {};

/**
 * Zenex incoming message
 * @date 2023-01-09
 * @typedef {http.IncomingMessage} ZenexServerRequest
 */
class ZenexServerRequest extends http.IncomingMessage {

}

/**
 * Zenex server response
 * @date 2023-01-09
 * @typedef {http.ServerResponse} ZenexServerResponse
 */
class ZenexServerResponse extends http.ServerResponse {
    /**
     * Send a file to the client
     * @date 2023-01-09
     * @param {string} path
     */
    sendFile = (path) => {}

    /**
     * Send a file to the client asynchronously
     * @date 2023-01-09
     * @param {string} path
     * @returns {Promise} promise
     */
    sendFileAsync = async (path) => {}

    /**
     * Send a JSON object to the client
     * @date 2023-01-09
     * @param {object} obj
     */
    sendJSON = (obj) => {}

    /**
     * Write a JSON object to the client
     * @date 2023-01-09
     * @param {object} obj
     */
    writeJSON = (obj) => {}
}

module.exports = {
    ZenexConfig,
    ZenexApp,
    ZenexHandler,
    ZenexServerRequest,
    ZenexServerResponse
};
