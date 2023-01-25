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
    host = '127.0.0.1';

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
     * @type {void}
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
        return path.join(this.mainDirectory(), file);
    }

    /**
     * Read and decrypt accounts if required
     * @returns {string}
     */
    readAccounts = () => {
        if (this.config.encrypt) {
            return this.decrypt(fs.readFileSync(this.accountFile()));
        }
        return fs.readFileSync(this.accountFile());
    }

    /**
     * Get accounts from the account system's account file
     * @returns {object}
     */
    getAccounts = () => {
        return JSON.parse(this.readAccounts());
    }

    /**
     * Get the key for the account system
     * @returns {string}
     */
    getKey = () => {
        if (!fs.existsSync(this.genPath(this.genNameFile('key')))) this.genKey();
        return fs.readFileSync(this.genPath(this.genNameFile('key'))).toString();
    }

    /**
     * Encrypt a string with the account system's key
     * @param {string} str
     */
    encrypt = (str) => {
        var key = this.getKey();
        var iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        var encrypted = cipher.update(str);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    /**
     * Decrypt a string with the account system's key
     * @param {string} str
     */
    decrypt = (str) => {
        var key = this.getKey().toString();
        var textParts = str.toString().split(':');
        var iv = Buffer.from(textParts.shift(), 'hex');
        var encryptedText = Buffer.from(textParts.join(':'), 'hex');
        var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        var decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    /**
     * Generate a new key for the account system
     */
    genKey = () => {
        if (fs.existsSync(this.genPath(this.genNameFile('key'))) && this.config.encrypt) {
            var curKey = fs.readFileSync(this.genPath(this.genNameFile('key'))).toString();
            var accounts = this.getAccounts();
            fs.unlinkSync(this.genPath(this.genNameFile('key')));
            var newKey = crypto.randomBytes(16).toString('hex');
            fs.writeFileSync(this.genPath(this.genNameFile('key')), newKey);
            this.writeAccounts(accounts);
        } else {
            var key = crypto.randomBytes(16).toString('hex');
            fs.writeFileSync(this.genPath(this.genNameFile('key')), key);
        }
    }

    /**
     * Initialize the account system
     */
    init = () => {
        this.mainDirectory = () => {
            return this.config.mainDirectory || path.resolve(path.join(require.main.path, 'ZenexAccounts'));
        } 
        if (!fs.existsSync(this.mainDirectory())) fs.mkdirSync(this.mainDirectory());

        this.accountFile = () => {
            return this.genPath(this.genNameFile('Accounts', this.config.encrypt ? 'zenexacc' : 'json'));
        }
        if (!fs.existsSync(this.accountFile())) this.writeAccounts([]);
        
        if (this.config.encrypt) this.getKey();
    }

    /**
     * Write accounts to the account system's account file
     * @param {object} accounts
     */
    writeAccounts = (accounts) => {
        var str = JSON.stringify(accounts, null, 4);

        if (this.config.encrypt) {
            fs.writeFileSync(this.accountFile(), this.encrypt(str));
            return;
        }
        fs.writeFileSync(this.accountFile(), str);
    }

    /**
     * Add an account to the account system
     * @param {object} account
     */
    addAccount = (account) => {
        const accounts = this.getAccounts();
        const id = crypto.randomBytes(16).toString('hex');
        account.id = id;
        accounts.push(account);
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
        for (var i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            let match = true;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    if (account[key] != element) match = false;
                }
            }
            if (match) return account;
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
        var matches = [];
        for (var i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            let match = true;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    if (account[key] != element) match = false;
                }
            }
            if (match) matches.push(account);
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
        const account = this.getAccount(id);
        for (const key in modify) {
            if (modify.hasOwnProperty(key)) {
                const element = modify[key];
                console.log(key, element)
                account[key] = element;
            }
        }
        accounts[accounts.findIndex(a => a.id == id)] = account;
        this.writeAccounts(accounts);
    }

    /**
     * Remove an account from the account system
     * @param {string} id
     */
    removeAccount = (id) => {
        const accounts = this.getAccounts();
        delete accounts[accounts.findIndex(a => a.id == id)]
        this.writeAccounts(accounts);
    }

    /**
     * Run a function for an array of account ids
     * @param {object} accounts
     * @param {function} func
     * @example
     * runForAccounts(getManyFromObject({username: 'test'}), (account) => {
     *     account.username = 'test2';
     *     return account;
     * });
     */
    runForAccounts = (accounts, func) => {
        for (var i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            var newAccount = func(account);
            if (newAccount) this.modifyAccount(account.id, newAccount);
        }
    }

    /**
     * Get account from id
     * @param {string} id
     */
    getAccount = (id) => {
        const accounts = this.getAccounts();
        return accounts[accounts.findIndex(a => a.id == id)];
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
     * Whether to encrypt the contents of the account system
     * @type {boolean}
     */
    encrypt = true;

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
