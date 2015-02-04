var inherits = require('inherits');
var Phaser = require('phaser');
var Entity = require('../ecs/Entity');

function Shield (game, x, y, key, frame) {
    Entity.call(this, game, x, y, key || 'sprites', frame || 'Effects/shield3');

    this.addComponent(require('../components/ArcadeBody'));
    this.addComponent(require('../components/Ownable'));

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

inherits(Shield, Entity);

Shield.prototype.damage = function(amount) {
    this.nextRegenTime = this.game.time.time + this.regenInterval;

    if (this.alive)
    {
        this.health -= amount;

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
