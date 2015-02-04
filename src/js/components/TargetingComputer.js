var inherits = require('inherits');
var Component = require('../ecs/Component');

function TargetingComputer (game, parent, data) {
    Component.call(this, game, parent, data);

    var self = this;
    Object.defineProperty(this.parent, 'target', {
        configurable: true,
        get: function () {
            return self.target;
        },
        set: function (value) {
            self.target = value;
        }
    });
}

inherits(TargetingComputer, Component);

TargetingComputer.prototype.target = null;

TargetingComputer.prototype.tearDown = function () {
    delete this.parent.target;
};

module.exports = TargetingComputer;
