var game = new Phaser.Game(800, 600, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, objectGroup, cursorPos, cursor;

var testx = 0, testy = 0;



BasicGame.Boot.prototype =
{
  preload: function () {
    game.load.image('tile', 'assets/tile-ph.png');

    game.time.advancedTiming = true;

    game.plugins.add(new Phaser.Plugin.Isometric(game));

    game.iso.anchor.setTo(0.5, 0.2);
  },
  create: function () {
    isoGroup = game.add.group();

    this.spawnTiles(1);

    cursorPos = new Phaser.Plugin.Isometric.Point3();
  },
  update: function () {
    //Lets update the cursorpos.
    game.iso.unproject(game.input.activePointer.position, cursorPos);

    isoGroup.forEach(function (tile) {
      var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);

      if (!tile.selected && inBounds) {
        tile.selected = true;
        tile.tint = 0x86bfda;

        testx = tile.isoX/18;
        testy = tile.isoY/18;


      }
      // If not, revert back to how it was.
      else if (tile.selected && !inBounds) {
        tile.selected = false;
        tile.tint = 0xffffff;

      }
    });



  },
  render: function () {
    //Debug stuff
    game.debug.text('X: '+ testx + ' Y: ' + testy, 2, 36, "#000");
    game.debug.text('FPS: '+ game.time.fps || '--', 2, 14, "#000");
  },
  spawnTiles: function (level) {
    tilesMap = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    var tile;
    for (var j = 0; j < tilesMap.length; j++) {
      for (var i = 0; i < tilesMap[j].length; i++) {
        if(tilesMap[j][i] == 0) {
          tile = game.add.isoSprite(i * 18, j * 18, 0, 'tile', 0, isoGroup);
        }
        tile.anchor.set(0.5, 0);
      }
    }
  }
}

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
