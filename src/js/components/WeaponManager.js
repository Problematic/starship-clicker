var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function WeaponManager (game, parent, data) {
    Component.call(this, game, parent, data);
}

inherits(WeaponManager, Component);

WeaponManager.prototype.fire = function () {
    this.parent.fire();
};

module.exports = WeaponManager;
