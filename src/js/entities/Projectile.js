var Phaser = require('phaser');

function Projectile (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);

    this.anchor.setTo(0.5);
    this.rotationOffset = Math.PI * 1.5;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this._owner = null;
}

Projectile.prototype = Phaser.Sprite.prototype;
Projectile.prototype.constructor = Projectile;

Object.defineProperty(Projectile.prototype, 'owner', {
    get: function () {
        return this._owner;
    },
    set: function (value) {
        this._owner = value;
        this.frameName = this.game.config[this._owner.shipType].projectileSprite;
    }
});

module.exports = Projectile;
