var Phaser = require('phaser');

function Projectile (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);

    this.anchor.setTo(0.5);
    this.rotationOffset = Math.PI * 1.5;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
}

Projectile.prototype = Phaser.Sprite.prototype;
Projectile.prototype.constructor = Projectile;

module.exports = Projectile;
