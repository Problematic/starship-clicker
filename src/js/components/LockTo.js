var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function LockTo (game, parent, data) {
    Component.apply(this, arguments);
}

LockTo.requires = [];

inherits(LockTo, Component);

LockTo.prototype.update = function () {
    this.parent.position.setTo(this.target.x, this.target.y);
};

module.exports = LockTo;
