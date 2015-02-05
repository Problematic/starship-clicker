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
    this.addComponent(components.HardpointManager);
    this.addComponent(components.WeaponManager);

    this.nextShotAt = game.time.time;
}

inherits(Starship, Entity);

Starship.prototype.shipType = null;

module.exports = Starship;
