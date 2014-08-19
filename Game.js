// Game.js

BunnyDefender.Game = function (game) {
  this.totalBunnies;
  this.bunnyGroup;
};

BunnyDefender.Game.prototype.create = function () {
  this.totalBunnies = 20;
  this.buildWorld();
};

BunnyDefender.Game.prototype.update = function () {
  
};

BunnyDefender.Game.prototype.buildWorld = function () {
  this.add.image(0, 0, 'sky');
  this.add.image(0, 800, 'hill');

  this.buildBunnies();
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


