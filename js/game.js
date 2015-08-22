var game = new Phaser.Game(800, 600, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, objectGroup, cursorPos, cursor;

var testx = 0, testy = 0;

//Class gameImage
function gameImage(imageName, path, tileHeight){
  this.imageName = imageName;
  this.path = path;
  this.tileHeight = tileHeight;
}
  
var images = [];

//Add new images manually..
images.push(new gameImage("tile", "assets/tile-ph.gif", 4));
images.push(new gameImage("road", "assets/road.gif", 4));
images.push(new gameImage("sidewalk", "assets/sidewalk.gif", 4));

//I dunno Brian
BasicGame.Boot.prototype =
{
  preload: function () {

    //Magic hurrdurr
    for(var i = 0; i < images.length; i++){
      var image = images[i];
      game.load.image(image.imageName, image.path);
    }

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

        testx = tile.isoX;
        testy = tile.isoY;


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
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
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
    for (var x = 0; x < tilesMap.length; x++) {
      for (var y = 0; y < tilesMap[x].length; y++) { 
        //var imageName = "tile";
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
  }
}

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
