const t = require('./templates.js');

module.exports = {
    awful: [{
        "name": "falling cat",
        "html": t.falling_cat,
        "points": -10,
        size: {
            min: 140,
            max: 192
        }
    }],
    bad: [
        {
            name: "bomb",
            html: t.bomb,
            points: -3,
            size: {
                min: 64,
                max: 64
            }
        },
        {
            name: "eggplant",
            html: t.eggplant,
            points: -1,
            size: {
                min: 64,
                max: 128
            }
        }
    ],
    good: [
        {
            name: "banana", html: t.banana, points: 1, size: {
                min: 110,
                max: 160
            }
        },
        {
            name: "banana",
            html: t.altBanana,
            points: 1,
            size: {
                min: 110,
                max: 160
            }
        }],
    rare: [{
        name: "magic banana", html: t.magicBanana, points: 3, size: {
            min: 90,
            max: 120
        }
    }],
    super: [{
        name: "super rare banana", html: t.superBanana, points: 10, size: {
            min: 70,
            max: 90
        }
    }]
};