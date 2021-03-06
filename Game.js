// Game.js

BunnyDefender.Game = function (game) {
  this.totalBunnies;
  this.bunnyGroup;
  this.totalSpacerocks;
  this.spacerockGroup;
  this.burst;
  this.gameOver;
  this.countdown;
  this.overMessage;
  this.secondsElapsed;
  this.timer;
  this.music;
  this.ouch;
  this.boom;
  this.ding;
};

BunnyDefender.Game.prototype.create = function () {
  this.gameOver = false;
  this.secondsElapsed = 0;
  // false => do not remove yourself from the game
  this.timer = this.time.create(false);
  // 1000 => every 1 sec
  this.timer.loop(1000, this.updateSeconds, this);
  this.totalBunnies = 20;
  this.totalSpacerocks = 13;

  this.music = this.add.audio('game_audio');
  // '' => marker in music
  this.music.play('', 0, 0.3, true);
  this.ouch = this.add.audio('hurt_audio');
  this.boom = this.add.audio('explosion_audio');
  this.ding = this.add.audio('select_audio');

  this.buildWorld();
};

BunnyDefender.Game.prototype.update = function () {
  // null => callback
  this.physics.arcade.overlap(
    this.spacerockGroup,
    this.burst,
    this.burstCollision,
    null,
    this);

  this.physics.arcade.overlap(
    this.spacerockGroup,
    this.bunnyGroup,
    this.bunnyCollision,
    null,
    this);

  this.physics.arcade.overlap(
    this.bunnyGroup,
    this.burst,
    this.friendlyFireCollision,
    null,
    this);
};

BunnyDefender.Game.prototype.updateSeconds = function () {
  this.secondsElapsed++;
}

BunnyDefender.Game.prototype.buildWorld = function () {
  this.add.image(0, 0, 'sky');
  this.add.image(0, 800, 'hill');

  this.buildBunnies();
  this.buildSpacerocks();
  this.buildEmitter();
  this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 
    'Bunnies Left ' + this.totalBunnies, 20);

  this.timer.start();
};

BunnyDefender.Game.prototype.buildBunnies = function () {
  this.bunnyGroup = this.add.group();
  this.bunnyGroup.enableBody = true;

  for (var i = 0; i < this.totalBunnies; i++) {
    var b = this.bunnyGroup.create(
      this.rnd.integerInRange(-10, this.world.width - 50),
      this.rnd.integerInRange(this.world.height - 180, this.world.height - 60),
      'bunny',
      'Bunny0000');
    b.anchor.setTo(0.5, 0.5);
    b.body.moves = false;
    b.animations.add('Rest', this.game.math.numberArray(1,58));
    b.animations.add('Walk', this.game.math.numberArray(68, 107));

    // Run at 24 frames per second.
    b.animations.play('Rest', 24, true);
    this.assignBunnyMovement(b);
  }
};

BunnyDefender.Game.prototype.assignBunnyMovement = function (b) {
  var bposition = Math.floor(this.rnd.realInRange(50, this.world.width - 50));
  var bdelay = this.rnd.integerInRange(2000, 6000);

  if (bposition < b.x) {
    b.scale.x = 1;
  } else {
    b.scale.x = -1;
  }

  var t = this.add.tween(b).to(
    {x : bposition}, 
    3500, 
    Phaser.Easing.Quadratic.InOut,
    true, 
    bdelay);

  t.onStart.add(this.startBunny, this);
  t.onComplete.add(this.stopBunny, this);
};


BunnyDefender.Game.prototype.startBunny = function (b) {
  b.animations.stop('Play');
  b.animations.play('Walk', 24, true)
};

BunnyDefender.Game.prototype.stopBunny = function (b) {
  b.animations.stop('Walk');
  b.animations.play('Rest', 24, true);
  this.assignBunnyMovement(b);
};

BunnyDefender.Game.prototype.buildSpacerocks = function () {
  this.spacerockGroup = this.add.group();
  for (var i = 0; i < this.totalSpacerocks; i++) {
    var r = this.spacerockGroup.create(
      this.rnd.integerInRange(0, this.world.width),
      this.rnd.realInRange(-1500, 0), 
      'spacerock', 
      'SpaceRock0000');
    var scale = this.rnd.realInRange(0.3, 1.0);
    r.scale.x = scale;
    r.scale.y = scale;
    this.physics.enable(r, Phaser.Physics.ARCADE);
    r.enableBody = true;
    r.body.velocity.y = this.rnd.integerInRange(200, 400);
    r.animations.add('Fall');
    r.animations.play('Fall, 24, true');

    r.checkWorldBounds = true;
    r.events.onOutOfBounds.add(this.resetRock, this);
  }
};

BunnyDefender.Game.prototype.resetRock = function(r) {
  if (r.y > this.world.height) {
    this.respawnRock(r);
  }
};

BunnyDefender.Game.prototype.respawnRock = function (r) {
  if (!this.gameOver) {
    r.reset(
      this.rnd.integerInRange(0, this.world.width),
      this.rnd.realInRange(-1500, 0)
      );
    r.body.velocity.y = this.rnd.integerInRange(200, 400);
  }
};

BunnyDefender.Game.prototype.buildEmitter = function () {
  // 80 particles at any given time
  this.burst = this.add.emitter(0, 0, 80);
  this.burst.minParticleScale = 0.3;
  this.burst.maxParticleScale = 1.2;
  this.burst.minParticleSpeed.setTo(-30, 30);
  this.burst.maxParticleSpeed.setTo(30, -30);
  this.burst.makeParticles('explosion');
  this.input.onDown.add(this.fireBurst, this);
};

BunnyDefender.Game.prototype.fireBurst = function (pointer) {
  if (!this.gameOver) {
    this.boom.play();
    this.boom.volume = 0.2;
    this.burst.emitX = pointer.x;
    this.burst.emitY = pointer.y;

    // true => burst acts as explosion
    // 2000 => 2 second lifespan
    // null => no frequency
    // 20 => 20 particles
    this.burst.start(true, 2000, null, 20);
  }
};

BunnyDefender.Game.prototype.burstCollision = function (r, b) {
  this.respawnRock(r);
};

BunnyDefender.Game.prototype.bunnyCollision = function (r, b) {
  if (b.exists) {
    this.respawnRock(r);
    this.killBunny(b);
  }
};

BunnyDefender.Game.prototype.checkBunniesLeft = function () {
  if (this.totalBunnies <= 0) {
    // Game over
    this.gameOver = true;
    this.music.stop();
    this.countdown.setText('Bunnies Left 0');
    this.overMessage = this.add.bitmapText(
      this.world.centerX - 180, 
      this.world.centerY - 40,
      "eightbitwonder",
      'GAME OVER\n\n' + "You lasted \n" + this.secondsElapsed + " seconds", 42);
    this.overMessage.align = "center";
    this.overMessage.inputEnabled = true;
    this.overMessage.events.onInputDown.addOnce(this.quitGame, this);
  } else {
    this.countdown.setText('Bunnies Left ' + this.totalBunnies);
  }
};

BunnyDefender.Game.prototype.friendlyFireCollision = function (b, e) {
  if (b.exists) {
    this.killBunny(b);
  }
};

BunnyDefender.Game.prototype.killBunny = function (b) {
  this.ouch.play();
  this.makeGhost(b);
  b.kill();
  this.totalBunnies--;
  this.checkBunniesLeft();
}

BunnyDefender.Game.prototype.makeGhost = function (b) {
  var bunnyGhost = this.add.sprite(b.x - 20, b.y - 180, 'ghost');
  bunnyGhost.anchor.setTo(0.5, 0.5);
  bunnyGhost.scale.x = b.scale.x;
  this.physics.enable(bunnyGhost, Phaser.Physics.ARCADE);
  bunnyGhost.enableBody = true;
  bunnyGhost.checkWorldBounds = true;
  bunnyGhost.body.velocity.y = -800;
};

BunnyDefender.Game.prototype.quitGame = function (pointer) {
  this.ding.play();
  this.state.start('StartMenu');
};