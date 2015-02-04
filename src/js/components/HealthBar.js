var inherits = require('inherits');
var Phaser = require('phaser');
var Component = require('../ecs/Component');

function HealthBar (game, parent, data) {
    Component.apply(this, arguments);

    this._bar = game.add.graphics(0, 0);
    this._bar.visible = false;
    this.parent.events.onKilled.add(function () {
        this._bar.visible = false;
    }, this);
    this.parent.events.onRevived.add(function () {
        this._bar.visible = true;
    }, this);
}

inherits(HealthBar, Component);

HealthBar.prototype.update = function () {
    this._bar.position.setTo(
        this.parent.world.x, this.parent.world.y
    );
    this._bar.clear();

    var width = this.parent.width;

    this._bar.lineStyle(1, 0xffffff, 1);

    this._bar.beginFill(0x000000);
    this._bar.drawRect(width * 0.75, -1 * this.parent.height * 0.5, width, 3);
    this._bar.endFill();

    this._bar.beginFill(0xff0000);
    this._bar.drawRect(width * 0.75, -1 * this.parent.height * 0.5, width * (this.parent.health / this.parent.shipConfig.health), 3);
    this._bar.endFill();

    this._bar.beginFill(0x0000ff);
    this._bar.drawRect(width * 0.75, -1 * this.parent.height * 0.5, width * (this.parent.shield.health / this.parent.shipConfig.shield), 3);
    this._bar.endFill();
};

module.exports = HealthBar;
