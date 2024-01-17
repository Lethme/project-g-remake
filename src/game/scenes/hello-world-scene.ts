import Phaser from 'phaser'
import {useUtils} from "@/utils";

export default class HelloWorldScene extends Phaser.Scene {
    logo!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    playerAnimation!: Phaser.Animations.Animation;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    beerPushedScore = 0;
    beerPushedScoreText?: Phaser.GameObjects.Text;

    utils = useUtils();

    constructor() {
        super('hello-world');
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
        this.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');

        this.load.image('beer', 'assets/img/beer.png');

        this.load.spritesheet("player", "assets/img/sprites/player.png", {
            frameWidth: 50,
            frameHeight: 60,
            startFrame: 0,
            endFrame: 5,
        });
    }

    create() {
        const image = this.add.image(400, 300, 'sky');

        image.setScale(3.8, 3);

        this.logo = this.physics.add.image(400, 100, 'beer');

        this.logo.setScale(0.5, 0.5);

        this.logo.setVelocity(200, 200);
        this.logo.setBounce(1, 1);
        this.logo.body.setCollideWorldBounds(true);

        this.playerAnimation = this.anims.create({
            key: "player_moving",
            frameRate: 60 / 8,
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        }) as Phaser.Animations.Animation;

        this.player = this.physics.add.sprite(100, 1000, "player").setScale(2, 2).play("player_moving");
        this.player.body.setGravityY(2000);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard?.createCursorKeys();

        //this.physics.world.setBoundsCollision(true, true, true, true);

        this.physics.add.collider(this.player, this.logo, () => {
            this.beerPushedScore += 1;
            this.beerPushedScoreText?.setText(`You pushed the beer ${this.beerPushedScore} times`);
        });

        this.physics.world.on("worldbounds", (body: any, up: any, down: any, left: any, right: any) => {
            console.log("TYest");
        })

        this.beerPushedScoreText = this.add.text(16, 16, "You pushed the beer 0 times", { fontSize: '32px', color: '#fff' });

        const escapeButton = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        escapeButton?.on("down", () => {
            this.game.isPaused ? this.game.resume() : this.game.pause();
        });
    }

    update(time: number, delta: number) {
        super.update(time, delta);

        this.logo.setRotation(this.logo?.rotation + 0.05);

        if (this.cursors?.left.isDown)
        {
            this.player.setVelocityX(-800);
        }
        else if (this.cursors?.right.isDown)
        {
            this.player.setVelocityX(800);
        }
        else
        {
            this.player.setVelocityX(0);
        }

        if (this.cursors?.up.isDown && this.player.body.blocked.down)
        {
            this.player.setVelocityY(-1000);
        }

        if (this.player.body.blocked.down) {
            if (this.player.anims.isPaused) {
                this.player.anims.resume();
            }
        } else {
            if (this.player.anims.isPlaying) {
                this.player.setFrame(this.utils.randomInt(0, 1) ? 3 : 0);
                this.player.anims.pause(this.playerAnimation.frames[6]);
            }
        }
    }
}
