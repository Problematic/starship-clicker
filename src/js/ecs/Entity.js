var Phaser = require('phaser');

function Entity (game, x, y) {
    Phaser.Sprite.call(this, game, x, y);

    this.components = new Set();
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;
