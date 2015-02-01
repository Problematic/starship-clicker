function PreloadState () {}

PreloadState.prototype = {
    preload: function onPreload (game) {
        game.load.image('starfield-blue', require('../../assets/backgrounds/starfield-blue.png'));

        game.load.atlasJSONArray('sprites', require('../../assets/spritesheet.png'), require('file!../../assets/spritesheet.json'));
        game.load.atlasJSONArray('explosions', require('../../assets/spritesheet-explosion.png'), require('file!../../assets/spritesheet-explosion.json'));

        game.load.json('game-config', require('file!../../config.json'));

        game.load.audio('retro-rumble1', require('../../assets/audio/retro/rumble1.ogg'));
        game.load.audio('retro-rumble2', require('../../assets/audio/retro/rumble2.ogg'));
        game.load.audio('retro-rumble3', require('../../assets/audio/retro/rumble3.ogg'));
    },
    create: function onCreate () {
        this.state.start('Game');
    }
};

module.exports = PreloadState;
