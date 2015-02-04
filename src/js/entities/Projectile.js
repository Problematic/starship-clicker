var inherits = require('inherits');
var Phaser = require('phaser');
var Entity = require('../ecs/Entity');
var components = require('../components');

function Projectile (game, x, y, key, frame) {
    Entity.call(this, game, x, y, key, frame);

    this.addComponent(components.ArcadeBody);
    this.addComponent(components.Ownable);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.events.onRevived.add(function () {
        var dim = this.height / 4;

        var sep = new Phaser.Point(0, 0);
        sep.rotate(sep.x, sep.y, this.rotation + this.rotationOffset, false, this.height);

        this.body.setSize(dim, dim, sep.x, sep.y);
    }, this);

    this.events.onOwnerChanged.add(function (owner) {
        this.frameName = this.game.config[owner.shipType].projectileSprite;
    }, this);
}

inherits(Projectile, Entity);

module.exports = Projectile;
