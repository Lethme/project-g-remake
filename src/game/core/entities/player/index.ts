import Phaser from 'phaser';
import GEntity from "@/game/core/entities/entity";
import GPlayerControls from "@/game/core/entities/player/types/player-controls.enum";

class GPlayer extends GEntity<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> {
    protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected playerAnimation!: Phaser.Animations.Animation;
    protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected controlsKeys?: {
        [key in keyof typeof GPlayerControls]: Phaser.Input.Keyboard.Key
    };

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public override getPhaserInstance(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this.player;
    }

    public override preload(): void {
        this.scene.load.spritesheet("player", "assets/img/sprites/player.png", {
            frameWidth: 50,
            frameHeight: 60,
            startFrame: 0,
            endFrame: 7,
        });
    }

    public override create(): void {
        this.playerAnimation = this.scene.anims.create({
            key: "player_moving",
            frameRate: 60 / 8,
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: 0,
                end: 7,
            }),
            repeat: -1,
        }) as Phaser.Animations.Animation;

        this.player = this.scene.physics.add.sprite(100, 1000, "player").setScale(2, 2).play("player_moving");
        this.player.body.setGravityY(2000);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.scene.input.keyboard?.createCursorKeys();

        this.controlsKeys = this.scene.input.keyboard?.addKeys({
            W: "W",
            D: "D",
            S: "S",
            A: "A",
        }) as any;
    }

    public override update(time: number, delta: number): void {
        if (this.cursors?.left.isDown || this.controlsKeys?.A.isDown)
        {
            this.player.setVelocityX(-800);
        }
        else if (this.cursors?.right.isDown || this.controlsKeys?.D.isDown)
        {
            this.player.setVelocityX(800);
        }
        else
        {
            this.player.setVelocityX(0);
        }

        if ((this.cursors?.up.isDown || this.controlsKeys?.W.isDown) && this.player.body.blocked.down)
        {
            this.player.setVelocityY(-1000);
        }

        if (this.player.body.blocked.down) {
            if (this.player.anims.isPaused) {
                this.player.anims.resume();
            }
        } else {
            if (this.player.anims.isPlaying) {
                this.player.anims.pause(this.playerAnimation.frames[this.utils.randomInt(0, 1) ? 4 : 0]);
            }
        }
    }

    public override destroy(): void {
        this.player.destroy();
        this.playerAnimation.destroy();
    }

    public static Create(scene: Phaser.Scene) {
        return new GPlayer(scene);
    }
}

export default GPlayer;