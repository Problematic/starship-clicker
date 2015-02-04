var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function ShipConfig (game, parent, data) {
    Component.apply(this, arguments);

    this.config = this.game.config[this.type];

    var self = this;
    Object.defineProperty(this.parent, 'shipConfig', {
        configurable: true,
        get: function () {
            return self.config;
        }
    });
}

ShipConfig.requires = [];

inherits(ShipConfig, Component);

ShipConfig.prototype.tearDown = function () {
    delete this.parent.shipConfig;
};

module.exports = ShipConfig;
