var Phaser = require('phaser');

function Projectile (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.anchor.setTo(0.5);
    this.rotationOffset = Math.PI * 1.5;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this._owner = null;

    this.events.onRevived.add(function () {
        var dim = this.height / 4;

        var sep = new Phaser.Point(0, 0);
        sep.rotate(sep.x, sep.y, this.rotation + this.rotationOffset, false, this.height);

        this.body.setSize(dim, dim, sep.x, sep.y);
    }, this);
}

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
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
