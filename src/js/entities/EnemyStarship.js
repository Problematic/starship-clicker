var Starship = require('./Starship');

function EnemyStarship (game, x, y, key, frame) {
    this.shipType = 'enemy';
    Starship.call(this, game, x, y, key, frame);
}

EnemyStarship.prototype = Object.create(Starship.prototype);
EnemyStarship.prototype.constructor = EnemyStarship;

EnemyStarship.prototype.update = function () {
    Starship.prototype.update.call(this);

    if (!this.alive) { return; }

    if (this.target !== null) {
        var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);
        var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
        this.rotation = rotation - this.rotationOffset;

        if (distance > this.game.config.enemy.minimumDistance) {
            this.game.physics.arcade.velocityFromRotation(rotation, this.game.config.enemy.minimumDistance, this.body.velocity);
        } else {
            this.body.velocity.setTo(0, 0);
        }

        this.fire();
    }
};

module.exports = EnemyStarship;
