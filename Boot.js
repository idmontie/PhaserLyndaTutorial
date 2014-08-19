// Boot.js

var BunnyDefender = {};

BunnyDefender.Boot = function (game) {};
BunnyDefender.Boot.prototype.preload = function () {};
BunnyDefender.Boot.prototype.create = function () {
  this.input.maxPointers = 1;
  this.stage.disableVisibilityChange = false;
  this.scale.scaleMode = Phase.ScaleManager.SHOW_ALL;
  this.scale.minWidth = 270;
  this.scale.minHeight = 480;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.stage.forcePortrait = true;
  this.scale.setScreenSize(true);

  this.input.addPointer();
  this.stage.backgroundColor = "#171642";

};