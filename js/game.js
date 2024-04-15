// create a new scene
const gameScene = new Phaser.Scene('Game');


gameScene.init = function() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.playerSpeed = 2.5;

    this.enemyMinSpeed = 1;
    this.enemyMaxSpeed = 3;

    this.enemyMinY = 85;
    this.enemyMaxY = this.height - this.enemyMinY;
}

// preload assets
gameScene.preload = function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('goal', 'assets/treasure.png')
}

// called once after the preload ends
gameScene.create = function() {
    this.background = this.add.image(this.centerX, this.centerY, 'background')

    this.player = this.add.image(70, this.centerY, 'player');
    this.player.setScale(.6);

    this.goal = this.add.image(this.width - 80, this.centerY, 'goal');
    this.goal.setScale(.6);

    this.enemy = this.add.image(200, this.centerY, 'enemy');
    this.enemy.setScale(.8);
    this.enemy.flipX = true;

    const dir = Math.random() < .5 ? -1 : 1;
    const speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)

    this.enemy.speed = dir * speed;
}

gameScene.update = function() {
    if (this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed;
    }

    const playerRect = this.player.getBounds();
    const goalRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
        this.scene.restart();
    }

    const isGoingUp = this.enemy.speed < 0 && this.enemy.y < this.enemyMinY;
    const isGoingDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY;

    if (isGoingUp || isGoingDown) {
        this.enemy.speed *= -1;
    }

    this.enemy.y += this.enemy.speed;
}

// set the configuration of the game
const config = {
    type: Phaser.AUTO, // phaser will use WebGL if available, if not it will use canvas API.
    width: 640,
    height: 360,
    scene: gameScene,
    antialias: false
}

// create a new game, pass the configuration
const game = new Phaser.Game(config);