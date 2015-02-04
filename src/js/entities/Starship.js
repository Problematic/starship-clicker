var inherits = require('inherits');
var Phaser = require('phaser');
var Projectile = require('./Projectile');
var Shield = require('./Shield');
var Entity = require('../ecs/Entity');
var components = require('../components');

function Starship (game, x, y, key, frame) {
    Entity.call(this, game, x, y, key, frame);

    this.addComponent(components.ArcadeBody);
    this.addComponent(components.DefenseManager);

    this.nextShotAt = game.time.time;
}

inherits(Starship, Entity);

Starship.prototype.shipType = null;

Starship.prototype.update = function () {
    Entity.prototype.update.call(this);
};

Starship.prototype.fire = function (target) {
    if (this.nextShotAt > this.game.time.time) { return; }

    target = target || this.target;

    var projectile = this.projectiles.getFirstDead();
    projectile.owner = this;
    var rotation = this.game.math.angleBetween(this.x, this.y, target.x, target.y);
    var sep = new Phaser.Point(this.x, this.y);
    sep.rotate(sep.x, sep.y, rotation, false, 16);

    projectile.rotation = rotation - projectile.rotationOffset;
    projectile.reset(sep.x, sep.y);
    projectile.revive();
    this.game.physics.arcade.velocityFromRotation(rotation, this.shipConfig.projectileSpeed, projectile.body.velocity);
    this.nextShotAt = this.game.time.time + (1000 / this.shipConfig.rateOfFire);

    var flare = this.game.add.sprite(sep.x, sep.y, 'sprites');
    flare.anchor.setTo(0.5);
    flare.scale.setTo(0.5);
    var anim = flare.animations.add('fire', Phaser.Animation.generateFrameNames('Lasers/laser' + this.shipConfig.projectileColor, 8, 9, '', 2), 120);
    anim.killOnComplete = true;
    flare.animations.play('fire');
};

module.exports = Starship;
