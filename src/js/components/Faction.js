var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function Faction (game, parent, data) {
    Component.apply(this, arguments);

    var self = this;
    Object.defineProperty(this.parent, 'faction', {
        configurable: true,
        get: function () {
            return self.faction;
        },
        set: function (value) {
            self.faction = value;
        }
    });
}

Faction.requires = [];

inherits(Faction, Component);

Faction.prototype.faction = null;

Faction.prototype.update = function () {};

Faction.prototype.tearDown = function () {
    delete this.parent.faction;
};

module.exports = Faction;
