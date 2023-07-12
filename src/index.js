//import "./styles.css";
import Phaser from "phaser";

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
  preload() {
    this.load.image("ground", "assets/platform.png");
    
    this.load.spritesheet("player", "assets/character.png", 
    {frameWidth: 32, frameHeight: 32});
    //players license https://craftpix.net/file-licenses/
  }

  create() {
    this.groundGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false
    })

    for (let i = 0; i < 20 ; i++) {
      this.groundGroup.create(Phaser.Math.Between(0, 
        game.config.width), Phaser.Math.Between(0, 
          game.config.height), "ground");
    }
  }
}