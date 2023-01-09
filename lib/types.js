const http = require('http');

const ZenexConfig = {
    errors: {
        notFound: (req, res) => {},
        serverError: (req, res) => {}
    },
    port: 80,
    host: 'localhost',
    disableStaticIndex: false,
    disableStaticPathResolve: false
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
const ZenexApp = {
    /**
     * Handler array called upon request
     * @date 2023-01-09
     */
    handlers: [],

    /**
     * Add a static path
     * @date 2023-01-09
     * @param {string} path
     */
    useStatic: (path) => {},

    /**
     * Use a handler
     * @date 2023-01-09
     * @param {ZenexHandler} handler
     */
    use: (handler) => {},

    /**
     * HTTP server
     * @date 2023-01-09
     * @type {http.Server}
     * @returns {http.Server}
     */
    http: null,

    /**
     * Create an HTTP server
     * @date 2023-01-09
     * @returns {http.Server}
     */
    createServer: () => {},

    /**
     * Listen on a port
     * @date 2023-01-09
     * @param {number} port
     * @param {function} callback
     */
    listen: (port, callback) => {}
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
}

module.exports = {
    ZenexConfig,
    ZenexApp
};
