var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function Ownable (game, parent, data) {
    Component.call(this, game, parent, data);

    var self = this;
    Object.defineProperty(this.parent, 'owner', {
        configurable: true,
        get: function () {
            return self.owner;
        },
        set: function (value) {
            self.owner = value;
            this.events.onOwnerChanged.dispatch(value);
        }
    });

    this.parent.events.onOwnerChanged = new Phaser.Signal();
}

inherits(Ownable, Component);

Ownable.prototype.owner = null;

Ownable.prototype.tearDown = function () {
    delete this.parent.owner;
};

module.exports = Ownable;
