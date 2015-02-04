var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');
var ShipConfig = require('./ShipConfig');
var DefenseManager = require('./DefenseManager');
var ShieldEntity = require('../entities/Shield');

function Shield (game, parent, data) {
    Component.apply(this, arguments);

    this.shipConfig = this.parent.shipConfig;

    this.shield = new ShieldEntity(game, 0, 0);
    this.shield.owner = this.parent;
    this.shield.regenInterval = this.shipConfig.shieldRegenInterval;
    this.shield.health = this.shipConfig.shield;
    this.shield.maxHealth = this.shipConfig.shield;
    this.shield.scale.x *= this.parent.spriteConfig.flip[0];
    this.shield.scale.y *= this.parent.spriteConfig.flip[1];
    this.parent.addChild(this.shield);

    if (this.parent.hasComponent(DefenseManager)) {
        this.parent.getComponent(DefenseManager).addDefense(this.shield);
    }

    this.parent.events.onRevived.add(function () {
        this.shield.revive(this.shipConfig.shield);
    }, this);

    var self = this;
    Object.defineProperty(this.parent, 'shield', {
        configurable: true,
        get: function () {
            return self.shield;
        }
    });
}

Shield.requires = [ShipConfig];

inherits(Shield, Component);

Shield.prototype.update = function () {
    this.shield.update();
};

Shield.prototype.tearDown = function () {
    delete this.parent.shield;
};

module.exports = Shield;
