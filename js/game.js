// create a new scene
const gameScene = new Phaser.Scene('Game');


gameScene.init = function() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.playerSpeed = 2.5;

    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4;

    this.enemyMinY = 50;
    this.enemyMaxY = this.height - this.enemyMinY;

    this.isGameOver = false;
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
    this.background = this.add.image(this.centerX, this.centerY, 'background');

    this.player = this.add.image(70, this.centerY, 'player');
    this.player.setScale(.6);

    this.goal = this.add.image(this.width - 80, this.centerY, 'goal');
    this.goal.setScale(.6);

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 3,
        setXY: {
            x: 160,
            y: 80,
            stepX: 100,
            stepY: 20
        }
    });

    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -.4, -.4);

    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.flipX = true;

        const dir = Math.random() < .5 ? -1 : 1;
        const speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)

        enemy.speed = dir * speed;
    }, this);
}

gameScene.update = function() {
    if (this.isGameOver) return;

    if (this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed;
    }

    const playerRect = this.player.getBounds();
    const goalRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
        this.gameOver(true);
    }

    for (const enemy of this.enemies.getChildren()) {
        const isGoingUp = enemy.speed < 0 && enemy.y < this.enemyMinY;
        const isGoingDown = enemy.speed > 0 && enemy.y >= this.enemyMaxY;
        const enemyRect = enemy.getBounds();

        if (isGoingUp || isGoingDown) {
            enemy.speed *= -1;
        }

        enemy.y += enemy.speed;

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            this.gameOver();
        }
    }

}

gameScene.gameOver = function(hasReachedGoal) {
    this.isGameOver = true;

    if (hasReachedGoal) {
        this.cameras.main.zoomTo(3);
        this.cameras.main.pan(this.player.x, this.player.y, 0);

        this.cameras.main.on('camerazoomcomplete', function () {
            this.scene.restart();
        }, this);

        return;
    }

    this.cameras.main.shake(500);

    this.cameras.main.on('camerashakecomplete', function () {
        this.cameras.main.fade(500);
    }, this);

    this.cameras.main.on('camerafadeoutcomplete', function() {
        this.scene.restart();
    }, this);
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