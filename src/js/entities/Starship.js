var Phaser = require('phaser');

function Starship (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.add.existing(this);

    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.gameConfig = game.cache.getJSON('game-config');
}

Starship.prototype = Object.create(Phaser.Sprite.prototype);
Starship.prototype.constructor = Starship;

Starship.prototype.target = null;

Starship.prototype.update = function () {
    if (this.target !== null) {
        var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
        var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
        this.rotation = rotation - this.rotationOffset;

        if (distance > this.gameConfig.enemy.minimumDistance) {
            this.game.physics.arcade.velocityFromRotation(rotation, this.gameConfig.enemy.minimumDistance, this.body.velocity);
        } else {
            this.body.velocity.setTo(0, 0);
        }
    }
};

module.exports = Starship;
