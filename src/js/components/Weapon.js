var inherits = require('inherits');
var Component = require('../ecs/Component');
var TargetingComputer = require('./TargetingComputer');

function Weapon (game, parent, data) {
    Component.call(this, game, parent);

    this.cooldown = data.cooldown;
    this.nextShotAt = 0;
}

Weapon.requires = [TargetingComputer];

inherits(Weapon, Component);

Weapon.prototype.fire = function () {
    if (this.nextShotAt > this.game.time.time) { return; }

    var target = this.parent.target;

    var projectile = this.projectiles.getFirstDead();
    projectile.owner = this;
    var rotation = this.game.math.angleBetween(this.x, this.y, target.x, target.y);
    var sep = new Phaser.Point(this.x, this.y);
    sep.rotate(sep.x, sep.y, rotation, false, 16);

    projectile.rotation = rotation - projectile.rotationOffset;
    projectile.reset(sep.x, sep.y);
    projectile.revive();
    this.game.physics.arcade.velocityFromRotation(rotation, this.game.config[this.shipType].projectileSpeed, projectile.body.velocity);
    this.nextShotAt = this.game.time.time + (1000 / this.game.config[this.shipType].rateOfFire);

    var flare = this.game.add.sprite(sep.x, sep.y, 'sprites');
    flare.anchor.setTo(0.5);
    flare.scale.setTo(0.5);
    var anim = flare.animations.add('fire', Phaser.Animation.generateFrameNames('Lasers/laser' + this.game.config[this.shipType].projectileColor, 8, 9, '', 2), 120);
    anim.killOnComplete = true;
    flare.animations.play('fire');
};

module.exports = Weapon;
