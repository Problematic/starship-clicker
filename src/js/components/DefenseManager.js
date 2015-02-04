var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function DefenseManager (game, parent, data) {
    Component.call(this, game, parent, data);

    this.defenses = [];
    this._cachedDamageFn = this.parent.damage;
    this.parent.damage = this.damage.bind(this);
    this.parent.events.onDefenseBreached = new Phaser.Signal();
}

inherits(DefenseManager, Component);

DefenseManager.prototype.defenses = null;

DefenseManager.prototype.addDefense = function (defense) {
    this.defenses.push(defense);
};

DefenseManager.prototype.removeDefense = function (defense) {
    this.defenses.splice(this.indexOf(defense), 1);
};

DefenseManager.prototype.damage = function (amount) {
    var defense;
    var soaked;
    for (var i = 0; i < this.defenses.length; i++) {
        defense = this.defenses[i];
        soaked = Math.min(defense.health, amount);
        defense.damage(soaked);
        if (soaked > 0 && defense.health <= 0) {
            this.parent.events.onDefenseBreached.dispatch(defense);
        }
        amount -= soaked;
        if (amount <= 0) { return; }
    }

    this._cachedDamageFn.call(this.parent, Math.min(this.parent.health, amount));
};

DefenseManager.prototype.tearDown = function () {
    this.parent.damage = this._cachedDamageFn;
};

module.exports = DefenseManager;
