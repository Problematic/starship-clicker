var Phaser = require('phaser');

function BootState () {}

BootState.prototype = {
    create: function onCreate (game) {
        game.stage.backgroundColor = 0xFFFFFF;
        // game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.plugins.juicy = game.plugins.add(require('plugins/Juicy'));

        game.state.start('Preload');
    }
};

module.exports = BootState;
