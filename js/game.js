var game = new Phaser.Game(900, 800, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, player, cursorPos, cursor;

var testx = 0, testy = 0;
var interactKey;

//Class gameImage
function gameImage(imageName, path, tileHeight){
  this.imageName = imageName;
  this.path = path;
  this.tileHeight = tileHeight;
}

var images = [];
var objects = [];

//Add new images manually..
images.push(new gameImage("tile", "assets/grass.gif", 5));
images.push(new gameImage("sidewalk", "assets/sidewalk.gif", 5));
images.push(new gameImage("road_left_0", "assets/road_left_0.gif", 5));
images.push(new gameImage("road_right_0", "assets/road_right_0.gif", 5));
images.push(new gameImage("road", "assets/road.gif", 5));
images.push(new gameImage("road_down_1", "assets/road_down_1.gif", 5));
images.push(new gameImage("road_up_1", "assets/road_up_1.gif", 5));
images.push(new gameImage("proad", "assets/proad.gif", 5));

BasicGame.Boot.prototype =
{
  preload: function () {
    game.load.image('player', 'assets/pvakt.png');
    game.load.image('car', 'assets/carFirst.png');

    //Magic hurrdurr
    for(var i = 0; i < images.length; i++){
      var image = images[i];
      game.load.image(image.imageName, image.path);
    }

    game.time.advancedTiming = true;

    game.plugins.add(new Phaser.Plugin.Isometric(game));

    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    game.iso.anchor.setTo(0.5, 0.2);
  },
  create: function () {
    isoGroup = game.add.group();
    carGroup = game.add.group();

    level_1_Map = [
      [0,0,0,0,0,0,1,2,3,1,0,0,0,0],
      [0,0,0,0,0,0,1,2,3,1,0,0,0,0],
      [0,0,0,0,0,0,1,2,3,1,0,0,0,0],
      [1,1,1,1,1,1,1,2,3,1,0,0,0,0],
      [1,7,7,7,7,7,1,2,3,1,0,0,0,0],
      [1,4,4,4,4,4,1,2,3,1,0,0,0,0],
      [1,4,4,4,4,4,6,2,3,1,0,0,0,0],
      [1,4,4,4,4,4,5,2,3,1,0,0,0,0],
      [1,4,4,4,4,4,1,2,3,1,0,0,0,0],
      [1,7,7,7,7,7,1,2,3,1,0,0,0,0],
      [1,1,1,1,1,1,1,2,3,1,0,0,0,0],
      [0,0,0,0,0,0,1,2,3,1,0,0,0,0],
      [0,0,0,0,0,0,1,2,3,1,0,0,0,0],
      [0,0,0,0,0,0,1,2,3,1,0,0,0,0],
    ];
    level_1_Cars = [
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
      [0,0,0,0,0,0,0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];


    this.spawnTiles(level_1_Map);
    this.spawnCars(level_1_Cars);

    player = game.add.isoSprite(32, 32, 0, 'player', 0, carGroup);
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
    interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

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

        testx = tile.isoX/33.54101966249684;
        testy = tile.isoY/33.54101966249684;
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

    var neartocar;
    for(var i = 0; i < objects.length; i++) {
      if (game.physics.isoArcade.distanceBetween(objects[i], player) < 34) {
        //console.log(objects[i]._isoPosition.x);
        if (typeof text == 'undefined') {
          text = game.add.text(player.x, player.y-50, "[E]");
          text.anchor.set(0.5, 0);
        } else {
          text.x = player.x;
          text.y = player.y-50;
        }
        neartocar = objects[i];
      } else {
        if (typeof text != 'undefined') {
          game.world.remove(text);
          text = undefined;
        }
      }
    }
    if (interactKey.isDown) {
      if (neartocar != null) {
        if (game.physics.isoArcade.distanceBetween(neartocar, player) < 34) {
          console.log("hej");
          
          neartocar.tint = 0x333333;
        }
      }

    }


    //Collide stuff
    game.physics.isoArcade.collide(carGroup);
    game.iso.simpleSort(carGroup);
  },
  render: function () {
    //Debug stuff
    game.debug.text('X: '+ testx + ' Y: ' + testy, 2, 36, "#fff");
    game.debug.text('FPS: '+ game.time.fps || '--', 2, 14, "#fff");
    //game.debug.bodyInfo(objects[0], 16, 24);

    //game.debug.body(player);
  },
  spawnTiles: function(tilesMap) {
    var tile;
    for (var x = 0; x < tilesMap.length; x++) {
      for (var y = 0; y < tilesMap[x].length; y++) {
        var imgObject = images[tilesMap[x][y]];
        var imgName = imgObject.imageName;
        var img = game.cache.getImage(imgName);
        var calcX = img.width - 2;
        var calcY = img.height - imgObject.tileHeight;

        var xx = calcX / (2 * Math.cos(this.game.iso.projectionAngle))
       + calcY / (2 * Math.sin(this.game.iso.projectionAngle));
        var size = xx/2;
        tile = game.add.isoSprite(y * size, x * size, 0, imgName, 0, isoGroup);
        tile.anchor.set(0.5, 0);
      }
    }
  },
  spawnCars: function(carsMap) {
    var object;
    for (var x = 0; x < carsMap.length; x++) {
      for (var y = 0; y < carsMap[x].length; y++) {
        if (carsMap[x][y] == 1) {
          object = game.add.isoSprite(x * 33.54101966249684, y * 33.54101966249684, 10, 'car', 0, carGroup);
          object.anchor.set(0.5, 0);
          game.physics.isoArcade.enable(object);
          //object.body.collideWorldBounds = true;
          object.body.immovable = true;
          objects.push(object);
        }
      }
    }

  }
}

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
