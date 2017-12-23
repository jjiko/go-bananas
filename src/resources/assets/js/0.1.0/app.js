let $ = require('jquery');
let $app = $({});

// trigger build
module.exports = {
    modules: {},
    init: function () {
        $app.on('app.done', function () {
            // hi!
        });

        $app.trigger({type: "app.start"});

        // App
        let $bananaStart = $('[data-role="bananas.start"]');
        if ($bananaStart.length) {
            this.modules.bananas = require('./app/bananas.js').init({isMobile: $('body').hasClass('mobile')});
            $bananaStart.on('click', this.modules.bananas.start);
        }

        $app.trigger({type: "app.done"});

        return this;
    }
};