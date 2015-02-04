var Phaser = require('phaser');
var Starship = require('../entities/Starship');
var EnemyStarship = require('../entities/EnemyStarship');
var Projectile = require('../entities/Projectile');
var components = require('../components');

function GameState () {}

GameState.prototype = {
    create: function onCreate (game) {
        console.log(game);

        game.config = this.config = game.cache.getJSON('game-config');

        // game.world.setBounds(-10000, -10000, 10000, 10000);

        this.background = game.add.tileSprite(-32, -32, game.stage.width + 64, game.stage.width + 64, 'starfield-blue');

        this.screenFlash = game.plugins.juicy.createScreenFlash('steelblue');
        game.add.existing(this.screenFlash);

        this.explosions = game.add.group(game.world, 'explosions');
        this.explosions.createMultiple(10, 'explosions');
        this.explosions.forEach(function (sprite) {
            sprite.anchor.setTo(0.5);
            sprite.scale.setTo(0.5);
            var anim = sprite.animations.add('regular', Phaser.Animation.generateFrameNames('Regular/regularExplosion', 0, 8, '', 2), 30);
            anim.killOnComplete = true;

            anim = sprite.animations.add('burst', ['Particles/burst'], 10);
            anim.killOnComplete = true;
        }, this);

        this.projectiles = game.add.group(game.world, 'projectiles');
        this.projectiles.classType = Projectile;
        this.projectiles.createMultiple(150, 'sprites', 'projectile');

        this.player = new Starship(game, game.camera.view.centerX, game.camera.view.centerY, 'sprites', 'playerShip3_red');
        this.player.addComponent(components.Invincible);
        this.player.body.drag.setTo(100);
        this.player.body.maxVelocity.setTo(this.config.player.maxVelocity);
        this.player.body.collideWorldBounds = true;
        this.player.nextShotAt = game.time.time;
        this.player.creds = 0;
        this.player.target = game.input.activePointer;
        this.player.projectiles = this.projectiles;

        // game.camera.follow(this.player);

        this.enemies = game.add.group(game.world, 'enemies');
        this.enemies.classType = EnemyStarship;
        this.enemies.createMultiple(10, 'sprites', 'Enemies/enemyBlack1');
        this.enemies.forEach(function (enemy) {
            enemy.body.drag.setTo(30);
            enemy.body.maxVelocity.setTo(100);
            enemy.body.collideWorldBounds = true;
            enemy.target = this.player;
            enemy.projectiles = this.projectiles;

            enemy.events.onKilled.add(function (enemy) {
                var explosion = this.explosions.getFirstDead();
                explosion.reset(enemy.x, enemy.y);
                explosion.animations.play('regular');

                var ct = this.combatTextPool.getFirstDead();
                ct.text.setText(this.config.enemy.credValue.toSignedString());
                ct.reset(enemy.x, enemy.y);
                var tween = game.add.tween(ct);
                tween.to({
                    y: '-50',
                    x: '-50',
                    alpha: 0
                }, 1000, 'Circ.easeOut');
                tween.onComplete.add(function () {
                    ct.kill();
                    ct.alpha = 1;
                });
                tween.start();

                this.player.creds += this.config.enemy.credValue;

                this.game.plugins.juicy.shake(16, 20);
                this.screenFlash.flash(0.05, 16);
            }, this);
        }, this);

        this.combatTextPool = game.add.group(game.world, 'combatText');
        this.combatTextPool.createMultiple(25);
        this.combatTextPool.forEach(function (sprite) {
            sprite.text = game.add.text(0, 0, '', { fill: 'white', font: '24px kenvector_futureregular' });
            sprite.addChild(sprite.text);
        }, this);

        this.controls = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        var credTextStyle = { fill: 'white', font: '18px kenvector_futureregular' };
        this.credText = game.add.text(10, 10, this.player.creds.toString(), credTextStyle);

        this.cursor = game.add.sprite(0, 0, 'ui', 'crossair_white');
        this.cursor.anchor.setTo(0.5);
    },
    update: function onUpdate (game) {
        game.physics.arcade.collide(this.player, this.enemies);
        game.physics.arcade.collide(this.enemies);

        game.physics.arcade.overlap(this.projectiles, this.enemies, function (projectile, enemy) {
            if (projectile.owner.shipType === 'enemy') { return; }

            // TODO: refactor this into the projectile itself
            var damage = this.game.config.player.projectileDamage * (Phaser.Math.chanceRoll(this.game.config.player.critChance * 100) ? this.game.config.player.critMultiplier : 1);
            enemy.damage(damage);
            projectile.kill();
            this.game.plugins.juicy.shake(16, 5);
        }, null, this);

        game.physics.arcade.overlap(this.projectiles, this.player, function (player, projectile) {
            if (projectile.owner.shipType === 'player') { return; }

            projectile.kill();
            this.game.plugins.juicy.shake(24, 25);
            this.screenFlash.flash(0.25, 16);

            this.player.damage(this.game.config.enemy.projectileDamage);

            if (this.player.shield.health > 0) { return; }

            var ct = this.combatTextPool.getFirstDead();
            ct.text.setText(this.config.enemy.hitCost.toSignedString());
            ct.reset(player.x, player.y);
            var tween = game.add.tween(ct);
            tween.to({
                y: '-50',
                x: '-50',
                alpha: 0
            }, 1000, 'Circ.easeOut');
            tween.onComplete.add(function () {
                ct.kill();
                ct.alpha = 1;
            });
            tween.start();

            this.player.creds += this.config.enemy.hitCost;
        }, null, this);

        if (game.input.activePointer.isDown) {
            this.player.fire();
        }

        // this.background.tilePosition.x -= this.player.deltaX * 1.5;
        // this.background.tilePosition.y -= this.player.deltaY * 1.5;

        if (this.enemies.countLiving() < 5) {
            for (var i = 0; i < game.rnd.integerInRange(0, 3); i++) {
                var enemy = this.enemies.getFirstDead();
                var p = new Phaser.Point(game.camera.view.randomX, game.camera.view.randomY);
                if (game.math.distance(p.x, p.y, this.player.x, this.player.y) < this.config.enemy.minimumDistance) {
                    continue;
                }
                enemy.reset(p.x, p.y);
                enemy.revive(enemy.maxHealth);
                var explosion = this.explosions.getFirstDead();
                explosion.reset(enemy.x, enemy.y);
                explosion.animations.play('burst');
            }
        }

        var rotation = this.game.math.angleBetween(this.player.x, this.player.y, this.player.target.x, this.player.target.y);
        this.player.rotation = rotation + this.player.rotationOffset;

        var acc = new Phaser.Point(0, 0);
        if (this.controls.up.isDown) {
            acc.add(0, -1);
        }
        if (this.controls.down.isDown) {
            acc.add(0, 1);
        }
        if (this.controls.left.isDown) {
            acc.add(-1, 0);
        }
        if (this.controls.right.isDown) {
            acc.add(1, 0);
        }

        acc.multiply(this.game.config.player.acceleration, this.game.config.player.acceleration);
        this.player.body.acceleration.setTo(acc.x, acc.y);
    },
    render: function onRender (game) {
        this.credText.setText(this.player.creds.toString());
        // game.debug.cameraInfo(game.camera, 10, 20);
        // game.debug.spriteInfo(this.player, 10, 125);

        // game.debug.body(this.player);
        // this.enemies.forEachAlive(function (sprite) {
        //     game.debug.body(sprite);
        // });

        this.cursor.position.setTo(
            game.input.activePointer.x, game.input.activePointer.y
        );
    }
};

module.exports = GameState;
