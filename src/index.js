//import "./styles.css";
import Phaser from "phaser";
import ground from "./assets/platform.png";
import player from "./assets/character.png";
import coin from "./assets/coin.png"
//https://stackoverflow.com/questions/66878947/image-is-not-getting-added-to-the-scene-phaser-3-5
// having the pictures show in the web browser

let game;

const gameOptions = {
  dudeGravity: 800,
  dudeSpeed: 300
}


window.onload = function() {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#336633",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 1000,
    },
    pixelArt:true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0
        }
      }
    },
    scene: PlayGame
  }
  game = new Phaser.Game(gameConfig);
  window.focus();

}

class PlayGame extends Phaser.Scene {

  constructor() {
    super("PlayGame");
    this.score = 0;
  }

  preload() {
    this.load.image("ground", ground);
    this.load.image("coin", coin);
    this.load.spritesheet("player", player, 
    {frameWidth: 32, frameHeight: 48});
    //players license https://craftpix.net/file-licenses/
  }

  create() {
    this.groundGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false
    })
    let coin2 = this.add.image(16, 16,"coin");
    coin2.setScale(0.08);

    for (let i = 0; i < 20 ; i++) {
      this.groundGroup.create(Phaser.Math.Between(0, 
        game.config.width), Phaser.Math.Between(0, 
          game.config.height), "ground");
    }
    this.player = this.physics.add.sprite(game.config.width / 2, game.config.height /2, "player");
    this.player.body.gravity.y = gameOptions.dudeGravity;
    this.physics.add.collider(this.player, this.groundGroup);

    this.coinGroup = this.physics.add.group({});
    this.physics.add.collider(this.coinGroup, this.groundGroup);

    this.physics.add.overlap(this.player, this.coinGroup, 
      this.collectCoin, null, this);

    this.scoreText = this.add.text(32, 2, "0", {fontSize: "30px", fill: "#ffffff"})

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", 
      {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: "turn",
      frames: [{key: "player", frame: 4}],
      frameRate: 10,
    })

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", 
      {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    })

    this.triggerTimer = this.time.addEvent({
      callback: this.addGround,
      callbackScope: this,
      delay: 700,
      loop: true
    })

  }

  addGround() {
    //console.log("adding stuff");
    this.groundGroup.create(Phaser.Math.Between(0, 
      game.config.width), 0, "ground");
    this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 6);
      
    if(Phaser.Math.Between(0,1)) {
      let coins = this.coinGroup.create(Phaser.Math.Between(0, 
        game.config.width), 0, "coin");
      coins.setScale(0.08);

      this.coinGroup.setVelocityY(gameOptions.dudeGravity);
    }
  
  
  }

  collectCoin(player, coins) {
    coins.disableBody(true, true);
    this.score += 1
    this.scoreText.setText(this.score);
  }

  update() {
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = -gameOptions.dudeSpeed;
      this.player.anims.play("left", true);
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x = gameOptions.dudeSpeed;
      this.player.anims.play("right", true);
    }
    else {
      this.player.body.velocity.x = 0;
      this.player.anims.play("turn", true);
    }

    if(this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -gameOptions.dudeGravity / 1.6;
    }

    if(this.player.y > game.config.height || this.player.y < 0) {
      this.scene.start("PlayGame")
    }

  }
}