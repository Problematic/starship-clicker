var Phaser = require('phaser');

function Shield (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key || 'sprites', frame || 'Effects/shield3');

    this.anchor.setTo(0.5);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    var anim = this.animations.add('remove', [
        // 'Effects/shield3',
        'Effects/shield2',
        'Effects/shield1',
    ], 24);
    anim.killOnComplete = true;

    this.events.onRevived.add(function () {
        this.frameName = 'Effects/shield3';
    }, this);

    this.regenInterval = 1000;
    this.nextRegenTime = null;
}

Shield.prototype = Object.create(Phaser.Sprite.prototype);
Shield.prototype.constructor = Shield;

Shield.prototype.damage = function(amount) {
    if (this.alive)
    {
        this.health -= amount;

        this.nextRegenTime = this.game.time.time + this.regenInterval;

        if (this.health <= 0)
        {
            this.animations.play('remove');
        }
    }

    return this;

};

Shield.prototype.update = function () {
    var prevHealth = this.health;

    if (this.nextRegenTime && this.nextRegenTime < this.game.time.time) {
        this.health = Math.min(this.health + 1, this.maxHealth);
        if (this.health < this.maxHealth) {
            this.nextRegenTime = this.game.time.time + this.regenInterval;
        } else {
            this.nextRegenTime = null;
        }
    }

    if (prevHealth <= 0 && this.health > 0) {
        this.revive(this.health);
    }
};

module.exports = Shield;
