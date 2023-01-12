/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const crypto = require('crypto');

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


    /**
     * Create a new AccountSystem
     * @param {AccountSystemConfig} config 
     * @returns {AccountSystem}
     */
    genAccountSystem = (config) => {};
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

class AccountSystem {
    /**
     * Account System constructor
     * @param {ZenexApp} app
     * @param {AccountSystemConfig} config
     */
    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.init();
    }

    /**
     * Configurations for the account system
     * @type {AccountSystemConfig}
     */
    config = new AccountSystemConfig();

    /**
     * Main directory of the account system
     * @type {string}
     */
    mainDirectory;

    /**
     * Generate a file name realtive to the account system's name
     * @param {string} str
     * @param {string} extention 
     * @returns 
     */
    genNameFile = (str, extention) => {
        return str + '-' + this.config.name + (extention ? '.' + extention : '');
    }
    
    /**
     * Generate a file path relative to the account system's main directory
     * @param {string} file
     */
    genPath = (file) => {
        return path.join(this.mainDirectory, file);
    }

    /**
     * Get accounts from the account system's account file
     */
    getAccounts = () => {
        return JSON.parse(fs.readFileSync(this.accountFile));
    }

    /**
     * Get accounts as an array
     */
    getAccountsArray = () => {
        var accounts = this.getAccounts();
        var arr = [];
        for (var i in accounts) {
            var acc = accounts[i];
            acc.id = i;
            arr.push(acc);
        }
        return arr;
    }

    /**
     * Initialize the account system
     */
    init = () => {
        this.mainDirectory = this.config.mainDirectory || this.mainDirectory || path.resolve(path.join(require.main.path, 'ZenexAccounts'));
        if (!fs.existsSync(this.mainDirectory)) fs.mkdirSync(this.mainDirectory);
        this.accountFile = this.genPath(this.genNameFile('Accounts', 'json'));
        if (!fs.existsSync(this.accountFile)) fs.writeFileSync(this.accountFile, '{}');
        this.accounts = this.getAccounts();
    }

    /**
     * Write accounts to the account system's account file
     * @param {object} accounts
     */
    writeAccounts = (accounts) => {
        fs.writeFileSync(this.accountFile, JSON.stringify(accounts, null, 4));
    }

    /**
     * Add an account to the account system
     * @param {object} account
     */
    addAccount = (account) => {
        const accounts = this.getAccounts();
        const id = crypto.randomBytes(16).toString('hex');
        while (accounts[id]) id = crypto.randomBytes(16).toString('hex');
        accounts[id] = account;
        this.writeAccounts(accounts);
        return id;
    }

    /**
     * Get an account from the account system based on an object
     * @param {object} obj
     * @returns {object} account
     */
    getFromObject = (obj) => {
        const accounts = this.getAccounts();
        for (const id in accounts) {
            if (accounts.hasOwnProperty(id)) {
                const account = accounts[id];
                let match = true;
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const element = obj[key];
                        if (account[key] != element) match = false;
                    }
                }
                account.id = id;
                if (match) return account;
            }
        }
        return null;
    }

    /**
     * Get multiple accounts from the account system based on an object
     * @param {object} obj
     * @returns {object[]} accounts
     */
    getManyFromObject = (obj) => {
        const accounts = this.getAccounts();
        const matches = [];
        for (const id in accounts) {
            if (accounts.hasOwnProperty(id)) {
                const account = accounts[id];
                let match = true;
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const element = obj[key];
                        if (account[key] != element) match = false;
                    }
                }
                account.id = id;
                if (match) matches.push(account);
            }
        }
        return matches;
    }

    /**
     * Modify an account in the account system
     * @param {string} id
     * @param {object} modify
     */
    modifyAccount = (id, modify) => {
        delete modify.id;
        const accounts = this.getAccounts();
        const account = accounts[id];
        if (!account) return;
        for (const key in modify) {
            if (modify.hasOwnProperty(key)) {
                const element = modify[key];
                account[key] = element;
            }
        }
        accounts[id] = account;
        this.writeAccounts(accounts);
    }

    /**
     * Remove an account from the account system
     * @param {string} id
     */
    removeAccount = (id) => {
        const accounts = this.getAccounts();
        delete accounts[id];
        this.writeAccounts(accounts);
    }

    /**
     * Run a function for a group of accounts
     * @param {object} accounts
     * @param {function} func
     */
    runForAccounts = (accounts, func) => {
        for (const id in accounts) {
            if (accounts.hasOwnProperty(id)) {
                const account = accounts[id];
                func(account);
            }
        }
    }

    /**
     * Get account from id
     * @param {string} id
     */
    getAccount = (id) => {
        const accounts = this.getAccounts();
        return accounts[id];
    }
}

class AccountSystemConfig {
    /**
     * Name of the account system globally
     * @type {string}
     */
    name = "Main";

    /**
     * Main directory of the account system
     * @type {string}
     */
    mainDirectory = path.resolve(path.join(require.main.path, 'ZenexAccounts'));

    /**
     * AccountSystem constructor
     * @param {AccountSystemConfig} config
     */
    constructor(config) {
        if (!config) return;
        
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                const element = config[key];
                this[key] = element;
            }
        }
    }
}

module.exports = {
    ZenexConfig,
    ZenexApp,
    ZenexHandler,
    ZenexServerRequest,
    ZenexServerResponse,
    AccountSystem,
    AccountSystemConfig
};
