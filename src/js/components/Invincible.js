var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function Invincible (game, parent, data) {
    Component.call(this, game, parent, data);

    this._cachedKillFn = this.parent.kill;
    this.parent.kill = function () {};
}

inherits(Invincible, Component);

Invincible.prototype.tearDown = function () {
    this.parent.kill = this._cachedKillFn;
};

module.exports = Invincible;
