var Phaser = require('phaser');
var Projectile = require('./Projectile');
var Shield = require('./Shield');

function Starship (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);

    this.spriteConfig = this.game.config.sprites[frame];

    this.anchor.setTo(0.5);

    var scale = this.spriteConfig.scale;
    this.scale.setTo(scale[0], scale[1]);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.nextShotAt = game.time.time;
    this.rotationOffset = Math.PI * this.spriteConfig.rotationOffsetMod;
    this.shipType = this.shipType || 'player';

    this.shipConfig = this.game.config[this.shipType];

    this.shield = new Shield(game, 0, 0);
    this.shield.owner = this;
    this.shield.regenInterval = this.shipConfig.shieldRegenInterval;
    this.shield.health = this.shipConfig.shield;
    this.shield.maxHealth = this.shipConfig.shield;
    this.shield.scale.x *= this.spriteConfig.flip[0];
    this.shield.scale.y *= this.spriteConfig.flip[1];
    this.addChild(this.shield);

    this.events.onRevived.add(function () {
        this.shield.revive(this.shipConfig.shield);
    }, this);
}

Starship.prototype = Object.create(Phaser.Sprite.prototype);
Starship.prototype.constructor = Starship;

Starship.prototype.target = null;
Starship.prototype.shipType = null;

Starship.prototype.update = function () {
    this.shield.update();
};

Starship.prototype.damage = function (amount) {
    var shieldHealth = this.shield.health;
    this.shield.damage(amount);

    if (amount - shieldHealth > 0) {
        Phaser.Sprite.prototype.damage.call(this, amount - shieldHealth);
    }
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
