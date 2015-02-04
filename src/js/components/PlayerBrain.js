var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');
var WeaponManager = require('./WeaponManager');

function PlayerBrain (game, parent, data) {
    Component.apply(this, arguments);
    this.weaponManager = this.parent.getComponent(WeaponManager);
}

PlayerBrain.requires = [WeaponManager];

inherits(PlayerBrain, Component);

PlayerBrain.prototype.update = function () {
    if (this.game.input.activePointer.isDown) {
        this.weaponManager.fire();
    }

    var rotation = this.game.math.angleBetween(this.parent.x, this.parent.y, this.parent.target.x, this.parent.target.y);
    this.parent.rotation = rotation + this.parent.rotationOffset;

    var acc = new Phaser.Point(0, 0);
    if (this.controls.up.isDown) {
        acc.add(0, -1);
    }
    if (this.controls.down.isDown) {
        acc.add(0, 1);
    }
    if (this.controls.left.isDown) {
        acc.add(-1, 0);
    }
    if (this.controls.right.isDown) {
        acc.add(1, 0);
    }

    acc.multiply(this.parent.shipConfig.acceleration, this.parent.shipConfig.acceleration);
    this.parent.body.acceleration.setTo(acc.x, acc.y);
};

module.exports = PlayerBrain;
