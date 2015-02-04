var inherits = require('inherits');
var Starship = require('./Starship');

function EnemyStarship (game, x, y, key, frame) {
    this.shipType = 'enemy';
    Starship.call(this, game, x, y, key, frame);

    this.healthbar = game.add.graphics(0, 0);
    this.healthbar.visible = false;
    this.events.onKilled.add(function () {
        this.healthbar.visible = false;
    }, this);
    this.events.onRevived.add(function () {
        this.healthbar.visible = true;
    }, this);

    this.maxHealth = this.shipConfig.health;
}

inherits(EnemyStarship, Starship);

EnemyStarship.prototype.update = function () {
    Starship.prototype.update.call(this);

    if (!this.alive) { return; }

    this.healthbar.position.setTo(
        this.world.x, this.world.y
    );
    this.healthbar.clear();

    var width = this.width;

    this.healthbar.lineStyle(1, 0xffffff, 1);

    this.healthbar.beginFill(0x000000);
    this.healthbar.drawRect(this.width * 0.75, -1 * this.height * 0.5, width, 3);
    this.healthbar.endFill();

    this.healthbar.beginFill(0xff0000);
    this.healthbar.drawRect(this.width * 0.75, -1 * this.height * 0.5, width * (this.health / this.maxHealth), 3);
    this.healthbar.endFill();

    this.healthbar.beginFill(0x0000ff);
    this.healthbar.drawRect(this.width * 0.75, -1 * this.height * 0.5, width * (this.shield.health / this.shipConfig.shield), 3);
    this.healthbar.endFill();

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
