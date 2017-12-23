/**
 * Banana core module
 * @module app/bananas
 */
'use strict';

/**
 * Falling object templates
 * @type {{eggplant: string, banana: string, banana2: string, magicBanana: string, superBanana: string, falling_cat: string, bomb: string, star: string, starFail: string, scoreTemplate: string}}
 */
const _t = require('./templates.js');

/** Falling object tiers **/
const _o = require('./tiers.js');

/**
 * Messages displayed on the score screen.
 * @type {string[]}
 */
const _m = require('./lang.js');

const $ = require('jquery');
const letterdrop = require('../../vendor/jquery.letterdrop.js');

/**
 * Set some default options
 * @type {{time: number, gameOver: {delay: number}, title: {delay: number}, runInterval: number, score: {delay: number}, spawnRate: number}}
 * @private
 */
const _defaults = {
    time: 60,
    gameOver: {
        delay: 5000
    },
    title: {
        delay: 3
    },
    runInterval: 5000,
    score: {
        delay: 6000
    },
    spawnRate: 10,
    objectOffset: 100,
    velocity: {
        min: 1400,
        max: 9000
    },
    isMobile: false
};

const _mobile_defaults = {
    spawnRate: 8,
    objectOffset: 0,
    velocity: {
        min: 1800,
        max: 9000
    },
    isMobile: true
};

let _r = {},
    _h = {},
    _d = {},
    _ui = {};

let _isGameOver = false;

let _score;
let _wackyMode = true;
let _timers = {
    /**
     * timeout
     */
    clock: 0,
    close: 0,
    /**
     * interval
     */
    populate: 0,
    start: 0,
    /**
     * timeout
     */
    title: 0
};

let _options;

_d.enableWackyMode = function() {
    $('body').addClass('wacky-banana-mode');
    _wackyMode = true;
};

_d.scoreObject = function () {
    return {
        "byTier": {
            "awful": {"generated": 1, "collected": 0},
            "bad": {"generated": 22, "collected": 0},
            "good": {"generated": 12, "collected": 7},
            "rare": {"generated": 3, "collected": 2},
            "super": {"generated": 2, "collected": 1}
        },
        "byName": {
            "falling cat": {"generated": 1, "collected": 0, "points": -10},
            "bomb": {"generated": 13, "collected": 0, "points": -3},
            "eggplant": {"generated": 9, "collected": 0, "points": -1},
            "banana": {"generated": 12, "collected": 7, "points": 1},
            "magic banana": {"generated": 3, "collected": 2, "points": 3},
            "super rare banana": {"generated": 2, "collected": 1, "points": 10}
        },
        "byPoints": 23
    };
};

_d.bind = function () {
    $(document).on('keydown', function (evt) {
        console.log("keydown", evt.key);

        if (evt.key === "Escape") {
            _kill();
        }

        if (evt.key === "g") {
            console.log("show gameover");
            _kill();
            _ui.$bananaTrigger.hide();
            _ui.$goBananas.show();
            _r.gameOver(true);
        }

        if (evt.key === "t") {
            console.log("show title");
            _kill();
            _ui.$bananaTrigger.hide();
            _ui.$goBananas.show();
            _r.title(true);
        }

        if (evt.key === "s") {
            console.log("show score");
            _kill();
            _bind();
            _ui.$bananaTrigger.hide();
            _ui.$goBananas.show();
            _ui.$score.data('score', _d.scoreObject());
            _options.score.delay = 0;
            _r.score();
        }
    });
};

_d.renderObjects = function () {
    $.each(_o, function (tier, objects) {
        $.each(objects, function (j, obj) {
            let {length, velocity, size} = _h.mechanics();
            let $box = _r.box(length, velocity, size);
            $box.data({'points': obj.points, 'name': obj.name, 'tier': tier});
            $box.append(obj.html);

            $('body').append($box);
        });
    });
};

// @todo move this to a config object somehow
_h.roll = function () {
    let rnum = Math.floor((Math.random() * 101));
    if (rnum < 2) {
        return "super";
    } else if (rnum >= 2 && rnum < 7) {
        return "rare";
    } else if (rnum >= 7 && rnum < 42) {
        return "good";
    } else if (rnum >= 42 && rnum < 98) {
        return "bad";
    }
    else {
        return "awful";
    }
};
_h.isGameOver = function () {
    let boxes = $('.box').length;
    if (_isGameOver && !boxes) {
        console.debug("all boxes have been removed", boxes);
        _r.gameOver();
        // _isGameOver = false;
        return true;
    }

    console.debug("still some boxes left", boxes);
    return false;
};

_h.mechanics = function ({min, max}) {
    if (typeof(min) === "undefined") {
        min = 50;
    }

    if (typeof(max) === "undefined") {
        max = 50;
    }

    let size = _h.random(min, max);
    let gameWidth = _ui.$game.width() - _options.objectOffset - size;
    let length = _h.random(_options.objectOffset, gameWidth);
    let velocity = _h.random(_options.velocity.min, _options.velocity.max);
    // let rotation = random(0, 180);

    return {length: length, velocity: velocity, size: size};
};

_h.random = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

function _initScore() {
    let scoreObj = {
        byTier: {},
        byName: {},
        byPoints: 0
    };
    $.each(_o, function (i, k) {
        scoreObj.byTier[i] = {generated: 0, collected: 0};
        $.each(k, function (j, v) {
            scoreObj.byName[v.name] = {generated: 0, collected: 0, points: v.points};
        });
    });

    _score = $.extend(true, {}, scoreObj);
    _ui.$score.data({score: _score}).empty().append(_score.byPoints);
}

function _countdown(s = 60) {
    function tick() {
        s--;
        /**
         * updates display with remaining time
         * @todo only show the timer when it's almost over < 15s?
         * **/
        _ui.$counter.empty().append((s < 10 ? "0" : "") + String(s) + "S");
        if (s > 0) {
            _timers.clock = setTimeout(tick, 1000);
        } else {
            clearInterval(_timers.populate);
            _isGameOver = true;
            return false;
        }
    }

    tick();
}

function _stop() {
    // _isGameOver = true;
    clearTimeout(_timers.start);
    clearTimeout(_timers.populate);
    clearTimeout(_timers.clock);
    clearTimeout(_timers.close);
    $('.box').remove();
}

let _kill = function (reset = false) {
    _stop();
    _unbind();
    _ui.$gameOver.hide();
    _ui.$gameOverScoreContainer.hide();
    _ui.$goBananas.hide();
    _ui.$bananaTrigger.fadeIn('slow');
};

let _reset = function () {
    _kill(true);
    _start();
};

let _populate = function () {
    for (let i = 0; i < _defaults.spawnRate; i++) {
        _r.objects();
    }
};

/**
 * Show title screen then populate falling objects
 * @see _populate
 * @private
 */
let _start = function () {
    _bind();
    _initScore();
    _isGameOver = false;

    _ui.$goBananas.show();
    _ui.$bananaTrigger.hide();
    if (_r.title()) {

        // Initial creation
        _timers.start = setTimeout(function () {
            _ui.$gameContainer.show();
            _populate();

            /**
             * keep creating
             * @todo randomize creation time?
             */
            _timers.populate = setInterval(function () {
                _populate();
            }, _options.runInterval);

            _countdown(_options.time);
        }, (_options.title.delay * 1000) + 300);
    }
};

/**
 * Render title screen
 */
_r.title = function (debug = false) {
    _ui.$title.show();

    if (!debug) {
        _timers.title = setTimeout(function () {
            _ui.$title.fadeOut('fast');
        }, (_options.title.delay * 1000));
        return true;
    }

    return false;
};


_r.ui = function () {

    $('body').append($(_t.game).clone());

    _ui["$bananaTrigger"] = $('.banana-trigger');
    _ui["$btnBananaBG"] = _ui.$bananaTrigger.find('.bg-btn-banana');
    _ui["$goBananas"] = $('.go-bananas');
    _ui["$game"] = $('.game');
    _ui["$gameContainer"] = $('.game-container');
    _ui["$gameOver"] = $('.game-over');
    _ui["$gameOverTxt"] = $('.game-over h1');
    _ui["$gameOverMessage"] = $('.game-over-message');
    _ui["$gameOverScore"] = $('.game-over-score');
    _ui["$gameOverScoreContainer"] = $('.game-over-score-container');
    _ui["$score"] = $('.score');
    _ui["$title"] = $('.game-title');
    _ui["$counter"] = $('.counter');
};

let _handleShortcuts = function (evt) {
    if (evt.key === "Escape") {
        _kill();
    }

    if (evt.key === "Backspace") {
        _stop();
        _r.gameOver();
    }
};

let _bind = function () {
    $(document).on('click', '.game-close', _kill);
    $(document).on('click', '.game-reset', _reset);

    $(document).on('keydown', _handleShortcuts);
};

let _unbind = function () {
    $(document).off('keydown', _handleShortcuts);
    $(document).off('click', '.close-bananas', _kill);
    $(document).off('click', '.reset-bananas', _reset);
};

_r.box = function (length, velocity, size) {
    return $(eval('`' + _t.box + '`'));
};

/**
 * Render objects
 */
_r.objects = function () {

    //set data and bg based on data
    let tier = _h.roll();
    let obj = _o[tier][Math.floor((Math.random() * _o[tier].length))];
    let {length, velocity, size} = _h.mechanics(obj.size);
    let $box = _r.box(length, velocity, size);
    $box.data({'points': obj.points, 'name': obj.name, 'tier': tier});
    $box.append(obj.html);


    //insert gift element
    _ui.$game.append($box);
    _score.byTier[tier].generated += 1;
    _score.byName[obj.name].generated += 1;

    let cleanup = 0;

    //random start for animation
    setTimeout(function () {
        $box.addClass("move");

        // backup in case transitionend doesn't fire
        cleanup = setTimeout(function () {
            $box.remove();
            _h.isGameOver();
        }, velocity);
    }, _h.random(0, 5000));

    $box.on('click', function () {
        let $this = $(this);

        _score.byPoints += $this.data('points');

        if(_wackyMode) {
            if($(this).data('points') < 1) {
                _ui.$btnBananaBG.addClass('bg-bad-banana');
            }
            else {
                if(_score.byPoints > 0) {
                    _ui.$btnBananaBG.removeClass('bg-bad-banana');
                }
            }
        }

        _score.byTier[$this.data('tier')].collected += 1;
        _score.byName[$this.data('name')].collected += 1;

        /** update points display **/
        _ui.$score.empty().append(_score.byPoints);
        _ui.$score.data({score: _score});
        $this.remove();
    });

    //remove this object when animation is over
    $box.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        function () {
            clearTimeout(cleanup);
            console.debug("** transitionend event **");
            let $this = $(this);
            $this.off('click');
            $this.remove();
            _h.isGameOver();
        });
};

_r.score = function () {
    let finalScore = _calcScore();
    _ui.$gameOverMessage.empty().append(finalScore.message);
    // _ui.$gameOverScore.find('.score-points-shield').append(_t.shield);
    _ui.$gameOverScore.find('.score-points-text').empty().append(finalScore.points);
    _ui.$gameOverScore.find('.score-stars').empty().append(finalScore.stars);
    _ui.$gameOverScore.find('.score-totals').empty().append(finalScore.totals);

    setTimeout(function () {
        _ui.$gameOverScoreContainer.fadeIn('slow');
        _timers.close = setTimeout(stop, (3 * 60 * 1000));
    }, _options.score.delay);
};

_r.gameOver = function (debug = false) {

    _ui.$gameOver.show();
    _ui.$gameOverTxt.letterDrop();

    _ui.$title.hide();
    _ui.$gameContainer.fadeOut('fast');

    if (!debug) {
        // Transition to score screen
        setTimeout(function () {
            _ui.$gameOver.fadeOut('fast');
        }, _options.gameOver.delay);

        _r.score();
    }
};

/**
 * Render the score after the game is over.
 * @returns {{stars: string, html, message: string}}
 */
let _calcScore = function () {
    let score = _ui.$score.data('score');
    let collectedBananas = score.byTier.good.collected + score.byTier.rare.collected + score.byTier.super.collected;
    let totalBananas = score.byTier.good.generated + score.byTier.rare.generated + score.byTier.super.generated;

    console.debug("collected", collectedBananas, "total", totalBananas);

    let totalPointsPossible = 0;

    // $.each(score.byName, function (k, a) {
    //     $.each(a, function (i, o) {
    //         if (score.byName[o.name].points > 0) {
    //             totalPointsPossible += (score.byName[o.name].points * score.byName[o.name].generated);
    //         }
    //     });
    // });

    $.each(score.byName, function (n, d) {
        if (d.points > 0) {
            totalPointsPossible += (d.points * d.generated);
        }
    });

    console.debug("totalPossible", totalPointsPossible);

    let scoreHtml = _t.score.replace('##B_COLLECTED##', collectedBananas).replace("##B_TOTAL##", totalBananas);
    let calcStars = Math.round((_ui.$score.data('score').byPoints / totalPointsPossible) * 4);
    let starsHtml = "";
    let starsMessage;
    console.debug("stars", calcStars);

    for (let i = 0; i < calcStars; i++) {
        starsHtml += _t.star;
    }

    if (calcStars <= 4) {
        for (let i = 0; i < (4 - calcStars); i++) {
            starsHtml += _t.starFail;
        }
    }
    if (calcStars >= 0) {
        starsMessage = _m.score[calcStars];
    }
    else {
        starsMessage = "....Really?";
    }

    return {stars: starsHtml, totals: scoreHtml, message: starsMessage, points: score.byPoints};
};

let _setup = function (options = {}) {
    if(_wackyMode) {
        $('body').addClass('wacky-banana-mode');
    }
    if (typeof(options.isMobile) !== "undefined") {
        if (options.isMobile) {
            // mobile
            let temp = $.extend(true, _defaults, _mobile_defaults);
            _options = $.extend(true, temp, options);
            _r.ui();
            return;
        }
    }

    // desktop
    _options = $.extend(true, _defaults, options);
    _r.ui();
};

module.exports = {
    init: function (options = {}) {
        _setup(options);

        _d.bind();
        _d.objects = _o;

        return {
            debug: _d,
            start: _start,
            score: function () {
                return _ui.$score.data('score');
            }
        }
    }
};