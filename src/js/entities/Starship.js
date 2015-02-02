var Phaser = require('phaser');
var Projectile = require('./Projectile');

function Starship (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);

    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.nextShotAt = game.time.time;

    this.shipType = this.shipType || 'player';
}

Starship.prototype = Object.create(Phaser.Sprite.prototype);
Starship.prototype.constructor = Starship;

Starship.prototype.target = null;
Starship.prototype.shipType = null;

Starship.prototype.update = function () {};

Starship.prototype.fire = function (target) {
    if (this.nextShotAt > this.game.time.time) { return; }

    target = target || this.target;

    var projectile = this.projectiles.getFirstDead();
    var rotation = this.game.math.angleBetween(this.x, this.y, target.x, target.y);
    var sep = new Phaser.Point(this.x, this.y);
    sep.rotate(sep.x, sep.y, rotation, false, 16);

    projectile.rotation = rotation - projectile.rotationOffset;
    projectile.reset(sep.x, sep.y);
    this.game.physics.arcade.velocityFromRotation(rotation, this.game.config[this.shipType].projectileSpeed, projectile.body.velocity);
    this.nextShotAt = this.game.time.time + (1000 / this.game.config[this.shipType].rateOfFire);

    var flare = this.game.add.sprite(sep.x, sep.y, 'sprites');
    flare.anchor.setTo(0.5);
    flare.scale.setTo(0.5);
    var anim = flare.animations.add('fire', Phaser.Animation.generateFrameNames('Lasers/laser' + this.game.config[this.shipType].projectileColor, 8, 9, '', 2), 120);
    anim.killOnComplete = true;
    flare.animations.play('fire');
};

module.exports = Starship;
