(function (factory) {
    console.log(module, module.exports);
    if (typeof module === "object" && typeof module.exports === "object") {
        factory(require("jquery"), window, document);
    } else {
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    $.fn.letterDrop = function () {
        // Chainability
        return this.each(function () {

            let obj = $(this);

            let drop = {
                arr: obj.text().split(''),

                range: {
                    min: 1,
                    max: 9
                },

                styles: function () {
                    let dropDelays = '\n';

                    for (let i = this.range.min; i <= this.range.max; i++) {
                        dropDelays += `.ld${i} { animation-delay: 1.${i}s; }\n`;
                    }

                    $('head').append($(`<style>${dropDelays}</style>`));
                },

                main: function () {
                    let dp = 0;
                    obj.text('');

                    $.each(this.arr, function (index, value) {

                        dp = dp.randomInt(drop.range.min, drop.range.max);

                        if (value === ' ')
                            value = '&nbsp;'; //Add spaces

                        obj.append(`<span class="letterDrop ld${dp}">${value}</span>`);

                    });

                }
            };

            Number.prototype.randomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            };


            // Create styles
            drop.styles();


            // Initialise
            drop.main();
        });

    };
}));