var inherits = require('inherits');
var Component = require('../ecs/Component');
var Phaser = require('phaser');

function ArcadeBody (game, parent, data) {
    Component.call(this, game, parent, data);

    this.game.physics.enable(this.parent, Phaser.Physics.ARCADE);
}

inherits(ArcadeBody, Component);

module.exports = ArcadeBody;
