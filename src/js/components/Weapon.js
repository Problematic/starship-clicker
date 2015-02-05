var inherits = require('inherits');
var Component = require('../ecs/Component');
var TargetingComputer = require('./TargetingComputer');

function Weapon (game, parent, hardpoint, blueprint) {
    Component.call(this, game, parent, blueprint);

    this.hardpoint = hardpoint;
    this.nextShotAt = game.time.time + (1000 / this.rateOfFire);
}

inherits(Weapon, Component);

Weapon.prototype.nextShotAt = null;

Object.defineProperty(Weapon.prototype, 'isReady', {
    get: function () {
        return this.nextShotAt <= this.game.time.time;
    }
});

Weapon.prototype.fire = function (target, projectile) {
    projectile.owner = this.parent.parent;  // entity
    projectile.frameName = this.projectile.sprite;
    projectile.payloadDamage = this.projectile.damage;

    var rotation = this.game.math.angleBetween(this.hardpoint.world.x, this.hardpoint.world.y, target.x, target.y);
    var sep = new Phaser.Point(this.hardpoint.world.x, this.hardpoint.world.y);
    sep.rotate(sep.x, sep.y, rotation, false, 16);

    projectile.rotation = rotation - projectile.rotationOffset;
    projectile.reset(sep.x, sep.y);
    projectile.revive();
    this.game.physics.arcade.velocityFromRotation(rotation, this.projectile.velocity, projectile.body.velocity);

    this.nextShotAt = this.game.time.time + (1000 / this.rateOfFire);

    var flare = this.game.add.sprite(sep.x, sep.y, 'sprites');
    flare.anchor.setTo(0.5);
    flare.scale.setTo(0.5);
    var anim = flare.animations.add('fire', Phaser.Animation.generateFrameNames(this.flareSprite, 8, 9, '', 2), 120);
    anim.killOnComplete = true;
    flare.animations.play('fire');
};

module.exports = Weapon;
