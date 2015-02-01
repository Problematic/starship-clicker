var Phaser = require('phaser');

function Loot (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);
}

Loot.prototype = Object.create(Phaser.Sprite.prototype);
Loot.prototype.constructor = Loot;

module.exports = Loot;
