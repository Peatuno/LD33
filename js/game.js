var game = new Phaser.Game(900, 800, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, player, cursorPos, cursor;

var testx = 0, testy = 0;



BasicGame.Boot.prototype =
{
  preload: function () {
    game.load.image('tile', 'assets/tile-ph.png');
    game.load.image('player', 'assets/pvakt.png');

    game.time.advancedTiming = true;

    game.plugins.add(new Phaser.Plugin.Isometric(game));

    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    game.iso.anchor.setTo(0.5, 0.2);
  },
  create: function () {
    isoGroup = game.add.group();

    this.spawnTiles(1);

    player = game.add.isoSprite(32, 32, 0, 'player', 0, isoGroup);
    player.anchor.set(0.5);
    game.physics.isoArcade.enable(player);
    player.body.collideWorldBounds = true;


    // Set up our controls.
    this.cursors = game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR
    ]);

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

        testx = tile.isoX/35;
        testy = tile.isoY/35;
      } else if (tile.selected && !inBounds) {
        tile.selected = false;
        tile.tint = 0xffffff;
      }
    });

    // Move the player at this speed.
    var speed = 100;
    if (this.cursors.up.isDown) {
      player.body.velocity.y = -speed;
    } else if (this.cursors.down.isDown) {
        player.body.velocity.y = speed;
    } else {
        player.body.velocity.y = 0;
    }
    if (this.cursors.left.isDown) {
        player.body.velocity.x = -speed;
    } else if (this.cursors.right.isDown) {
        player.body.velocity.x = speed;
    } else {
        player.body.velocity.x = 0;
    }


  },
  render: function () {
    //Debug stuff
    game.debug.text('X: '+ testx + ' Y: ' + testy, 2, 36, "#000");
    game.debug.text('FPS: '+ game.time.fps || '--', 2, 14, "#000");
  },
  spawnTiles: function (level) {
    tilesMap = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    var tile;
    for (var j = 0; j < tilesMap.length; j++) {
      for (var i = 0; i < tilesMap[j].length; i++) {
        if(tilesMap[j][i] == 0) {
          tile = game.add.isoSprite(i * 35, j * 35, 0, 'tile', 0, isoGroup);
        }
        tile.anchor.set(0.5, 0);
      }
    }
  }
}

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
