var Phaser = require('phaser');

function BootState () {}

BootState.prototype = {
    create: function onCreate (game) {
        game.stage.backgroundColor = 0xFFFFFF;
        // game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.plugins.juicy = game.plugins.add(require('plugins/Juicy'));
        game.input.maxPointers = 1;

        game.state.start('Preload');

        Number.prototype.toSignedString = function () {
            return this > 0 ? '+' + this.toString() : this.toString();
        };
    }
};

module.exports = BootState;
