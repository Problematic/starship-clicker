var Phaser = require('phaser');

function Component (game, parent, data) {
    this.game = game;
    this.parent = parent;

    data = data || {};
    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
            this[prop] = data[prop];
        }
    }
}

Component.requires = [];

Component.prototype.enabled = true;

Component.prototype.update = function () {};

Component.prototype.remove = function () {};

module.exports = Component;
