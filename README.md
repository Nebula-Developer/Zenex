# Zenex - Simple and blazing fast web framework for Node.js

Zenex is a simple web framework that allows developing web servers quickly and efficiently. It is built on top of [Node.js](https://nodejs.org/en/)'s [http](https://nodejs.org/api/http.html) module, and has a runtime similar to [Express](https://expressjs.com/). (Zenex is compatible with Express, and can be used as a syntax-alternative drop-in replacement for Express.)

Zenex is designed to be simple and easy to use, and is suited for use in any sized projects. It is not intended to be a full-featured framework like Express, but rather a lightweight framework+langauge extension pack that allows you to write web servers quickly and efficiently.

## Installation

Installing Zenex is easy. Simply run the following command in your terminal:

```bash
npm install zenex
```

## Usage

Zenex is imported as a module, and constructed with the `zenex()` function:

```js
const zenex = require('zenex');
const app = zenex();
```

The `app` object supplies everything you need to create a web server. To make a static HTTP server, use:

```js
var server = app.createServer();
app.useStatic('public'); // Host files in the 'public' directory
```

Now, lets listen on the port 3000:

```js
app.listen(3000, () => {
    console.log('Listening on port 3000');
});
```

When we call `app.useStatic()`, it appends a 'handler' function to the handler stack. When a request is made, the handler stack is iterated through, and the first handler that matches the request is called. The `useStatic()` handler matches all requests, and serves the requested file if it exists. If the file does not exist, the next handler in the stack is called.


## Accounts

Now introducing the **Zenex Account System**! This is a simple account system that allows you to create accounts into a local database. It is designed to be lightweight yet flexible. It is not intended to be a full-featured account system.

Documentation for the account system will be available soon.
JSDoc is supplied, and most features are self-explanatory :]
