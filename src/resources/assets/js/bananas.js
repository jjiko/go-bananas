// Hi :)
let tid = setInterval( function () {
    if ( document.readyState !== 'complete' ) return;
    clearInterval( tid );
    window.app = require('./0.1.0/app.js').init();
}, 100 );