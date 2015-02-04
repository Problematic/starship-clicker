var inherits = require('inherits');
var Phaser = require('phaser');
var Entity = require('../ecs/Entity');
var DefenseManager = require('../components/DefenseManager');

function Shield (game, x, y, parent) {
    Entity.call(this, game, x, y, 'sprites', 'Effects/shield3');

    this.addComponent(require('../components/Ownable'));
    this.owner = parent;

    var anim = this.animations.add('remove', [
        // 'Effects/shield3',
        'Effects/shield2',
        'Effects/shield1',
    ], 24);
    anim.killOnComplete = true;

    this.events.onRevived.add(function () {
        if (anim.isPlaying) {
            // we do this so that the shield isn't immediately killed if we're
            // grabbed out of the object pool before the animation is done
            anim.stop();
        }
        this.frameName = 'Effects/shield3';
    }, this);

    this.nextRegenTime = null;
    this.regenInterval = this.owner.shipConfig.shieldRegenInterval;
    this.health = this.owner.shipConfig.shield;
    this.maxHealth = this.owner.shipConfig.shield;
    this.scale.x *= this.owner.spriteConfig.flip[0];
    this.scale.y *= this.owner.spriteConfig.flip[1];

    if (this.owner.hasComponent(DefenseManager)) {
        this.owner.getComponent(DefenseManager).addDefense(this);
    }

    this.owner.events.onRevived.add(function () {
        this.revive(this.owner.shipConfig.shield);
    }, this);
    this.owner.shield = this;
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
