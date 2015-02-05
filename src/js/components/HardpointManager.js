var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');
var Entity = require('../ecs/Entity');

function HardpointManager (game, parent, data) {
    Component.apply(this, arguments);

    this.hardpoints = [];

    var self = this;
    Object.defineProperty(this.parent, 'hardpoints', {
        configurable: true,
        get: function () {
            return self.hardpoints;
        }
    });
}

HardpointManager.requires = [];

inherits(HardpointManager, Component);

HardpointManager.prototype.addHardpoint = function (hardpoint) {
    var e = new Entity(this.game, hardpoint.x - this.parent.width / 2, hardpoint.y - this.parent.height / 2);
    this.hardpoints.push(e);
    this.parent.addChild(e);
};

HardpointManager.prototype.tearDown = function () {
    delete this.parent.hardpoints;
};

module.exports = HardpointManager;
