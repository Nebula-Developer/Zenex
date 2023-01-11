/*!
 * Zenex - https://github.com/nebula-developer/zenex
 * Simple and blazing fast web framework for Node.js
 * 
 * (c) Nebula Developments - 2022-2023
 * MIT License
 */

function html(buffer) {
    var node = process.version;
    var str = buffer.toString();
    str = str.replace(/{{node}}/g, node);
    str = str.replace(/{{uptime}}/g, process.uptime());

    // Replace {{load("file.example")}} with the fetched file
    var load = str.match(/{{fetch\("(.*?)"\)}}/g);
    if (load) {
        console.log(load);
        for (var i = 0; i < load.length; i++) {
            var file = load[i].match(/{{fetch\("(.+)"\)}}/)[1];
        }
    }

    str += `
    <script>
        window.Zenex = {
            version: '${process.version}',
            uptime: ${process.uptime()}
        }
    </script>
    `;

    return Buffer.from(str);
}

function css(buffer) {
    return buffer;
}

function js(buffer) {
    return buffer;
}

module.exports = {
    html, css, js
};
