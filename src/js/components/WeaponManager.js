var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');
var Weapon = require('./Weapon');
var TargetingComputer = require('./TargetingComputer');

function WeaponManager (game, parent, data) {
    Component.call(this, game, parent, data);

    this.weapons = [];
    this.targetingComputer = this.parent.getComponent(TargetingComputer);
}

WeaponManager.requires = [TargetingComputer];

WeaponManager.FiringMode = {
    ALTERNATING: 0,
    LINKED: 1
};

inherits(WeaponManager, Component);

WeaponManager.prototype.projectiles = null;

WeaponManager.prototype.createWeapon = function (hardpoint, blueprint) {
    var weapon = new Weapon(this.game, this, hardpoint, blueprint);
    this.weapons.push(weapon);

    return weapon;
};

WeaponManager.prototype.fire = function () {
    var weapon;
    for (var i = 0; i < this.weapons.length; i++) {
        weapon = this.weapons[i];
        if (weapon.isReady) {
            weapon.fire(this.targetingComputer.target, this.projectiles.getFirstDead());
        }
    }
};

module.exports = WeaponManager;
