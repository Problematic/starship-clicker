var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');
var WeaponManager = require('./WeaponManager');
var TargetingComputer = require('./TargetingComputer');

function AIBrain (game, parent, data) {
    Component.apply(this, arguments);

    this.weaponManager = this.parent.getComponent(WeaponManager);
}

AIBrain.requires = [WeaponManager, TargetingComputer];

inherits(AIBrain, Component);

AIBrain.prototype.update = function () {
    if (!this.parent.alive) { return; }

    var target = this.parent.target;

    if (target) {
        var distance = this.game.math.distance(this.parent.x, this.parent.y, target.x, target.y);
        var rotation = this.game.math.angleBetween(this.parent.x, this.parent.y, target.x, target.y);
        this.parent.rotation = rotation - this.parent.rotationOffset;

        if (distance > this.game.config.enemy.minimumDistance) {
            this.game.physics.arcade.velocityFromRotation(rotation, this.game.config.enemy.minimumDistance, this.parent.body.velocity);
        } else {
            this.parent.body.velocity.setTo(0, 0);
        }

        this.weaponManager.fire();
    }
};

module.exports = AIBrain;
