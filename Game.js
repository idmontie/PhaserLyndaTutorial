// Game.js

BunnyDefender.Game = function (game) {
  this.totalBunnies;
  this.bunnyGroup;
  this.totalSpacerocks;
  this.spacerockGroup;
};

BunnyDefender.Game.prototype.create = function () {
  this.totalBunnies = 20;
  this.totalSpacerocks = 13;
  this.buildWorld();
};

BunnyDefender.Game.prototype.update = function () {
  
};

BunnyDefender.Game.prototype.buildWorld = function () {
  this.add.image(0, 0, 'sky');
  this.add.image(0, 800, 'hill');

  this.buildBunnies();
  this.buildSpacerocks();
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
  r.reset(
    this.rnd.integerInRange(0, this.world.width),
    this.rnd.realInRange(-1500, 0)
    );
  r.body.velocity.y = this.rnd.integerInRange(200, 400);
}
