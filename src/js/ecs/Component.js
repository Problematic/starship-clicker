var Phaser = require('phaser');

function Component (game, parent, data) {
    this.game = game;
    this.parent = parent;
    this.data = data;
}

Component.requires = [];

Component.prototype.enabled = true;

Component.prototype.update = function () {};

Component.prototype.remove = function () {};

module.exports = Component;
