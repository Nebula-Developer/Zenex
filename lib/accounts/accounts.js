/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

const { ZenexApp, AccountSystem, AccountSystemConfig } = require('../types');
const path = require('path');

/**
 * Create a new AccountSystem
 * @param {ZenexApp} app 
 * @param {object} config 
 * @returns {AccountSystem}
 */
function genAccountSystem(app, config) {
    return new AccountSystem(app, new AccountSystemConfig(config));
}

module.exports = {
    genAccountSystem
}
