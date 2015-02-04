var Phaser = require('phaser');
var Component = require('./Component');

function Entity (game, x, y, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.game.add.existing(this);

    this.components = new Map();

    this.spriteConfig = this.game.config.sprites[frame];
    this.scale.setTo.apply(this.scale, this.spriteConfig.scale);
    this.anchor.setTo.apply(this.anchor, this.spriteConfig.anchor);
    this.rotationOffset = Math.PI * this.spriteConfig.rotationOffsetMod;
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

Entity.prototype.update = function () {
    this.components.forEach(function (c) {
        c.update();
    });
};

Entity.prototype.addComponent = function (Constructor, data) {
    for (var i = 0; i < Constructor.requires; i++) {
        if (!this.hasComponent(Constructor.requires[i])) {
            this.addComponent(Constructor.requires[i], null);
        }
    }

    var c = new Constructor(this.game, this, data);
    this.components.set(Constructor, c);

    return c;
};

Entity.prototype.hasComponent = function (Constructor) {
    return this.components.has(Component);
};

Entity.prototype.getComponent = function (Constructor) {
    return this.components.get(Component);
};

Entity.prototype.removeComponent = function (Constructor) {
    var c = this.components.get(Constructor);
    c.tearDown();
    this.components.delete(Constructor);
};

module.exports = Entity;
