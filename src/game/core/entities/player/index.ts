import Phaser from 'phaser';
import GEntity from "@/game/core/entities/entity";
import {
    GPlayerControls,
    GPlayerSpritesheet,
    GPlayerImages
} from "@/game/core/entities/player/types";

import {
    GBullet,
    GBulletGroup,
} from "@/game/core/entities/player/bullet";

class GPlayer extends GEntity<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> {
    protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected playerAnimation!: Phaser.Animations.Animation;
    protected playerMovingLeftAnimation!: Phaser.Animations.Animation;
    protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected controlsKeys!: {
        [key in keyof typeof GPlayerControls]: Phaser.Input.Keyboard.Key
    };
    protected cds!: GBulletGroup;

    public get bulletsAmount(): number { return this.cds.bulletsAmount };
    public get bullets(): GBulletGroup { return this.cds };

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public override getPhaserInstance(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this.player;
    }

    public override preload(): void {
        this.scene.load.spritesheet(GPlayerSpritesheet.MOVING_RIGHT, "assets/img/sprites/player.png", {
            frameWidth: 50,
            frameHeight: 60,
            startFrame: 0,
            endFrame: 7,
        });

        this.scene.load.spritesheet(GPlayerSpritesheet.MOVING_LEFT, "assets/img/sprites/player-left.png", {
            frameWidth: 50,
            frameHeight: 60,
            startFrame: 0,
            endFrame: 7,
        });

        this.scene.load.image(GPlayerImages.CD, "assets/img/sprites/cd.png");
    }

    public override create(): void {
        this.playerAnimation = this.scene.anims.create({
            key: GPlayerSpritesheet.MOVING_RIGHT,
            frameRate: 60 / 8,
            frames: this.scene.anims.generateFrameNumbers(GPlayerSpritesheet.MOVING_RIGHT, {
                start: 0,
                end: 7,
            }),
            repeat: -1,
        }) as Phaser.Animations.Animation;

        this.playerMovingLeftAnimation = this.scene.anims.create({
            key: GPlayerSpritesheet.MOVING_LEFT,
            frameRate: 60 / 8,
            frames: this.scene.anims.generateFrameNumbers(GPlayerSpritesheet.MOVING_LEFT, {
                start: 0,
                end: 7,
            }),
            repeat: -1,
        }) as Phaser.Animations.Animation;

        this.player = this.scene.physics.add.sprite(100, 1000, GPlayerSpritesheet.MOVING_RIGHT).setScale(2, 2).play(GPlayerSpritesheet.MOVING_RIGHT);
        this.player.body.setGravityY(2000);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.scene.input.keyboard?.createCursorKeys()!;

        this.controlsKeys = this.scene.input.keyboard?.addKeys({
            W: "W",
            D: "D",
            S: "S",
            A: "A",
            SPACE: "Space",
        }) as any;

        this.cds = new GBulletGroup(this.scene);

        this.controlsKeys.SPACE.on("down", () => {
            this.cds.fireCD(this.player.x, this.player.y, this.player.texture.key === GPlayerSpritesheet.MOVING_LEFT ? -1500 : 1500);
            this.emit("player:bullets-amount-changed", this);
        });
    }

    public override update(time: number, delta: number): void {
        if (this.cursors.left.isDown || this.controlsKeys.A.isDown)
        {
            if (this.player.texture.key !== GPlayerSpritesheet.MOVING_LEFT) {
                this.player.setTexture(GPlayerSpritesheet.MOVING_LEFT);
                this.player.play(GPlayerSpritesheet.MOVING_LEFT);
            }

            this.player.setVelocityX(-800);
        }
        else if (this.cursors.right.isDown || this.controlsKeys.D.isDown)
        {
            if (this.player.texture.key !== GPlayerSpritesheet.MOVING_RIGHT) {
                this.player.setTexture(GPlayerSpritesheet.MOVING_RIGHT);
                this.player.play(GPlayerSpritesheet.MOVING_RIGHT);
            }

            this.player.setVelocityX(800);
        }
        else
        {
            if (this.player.texture.key !== GPlayerSpritesheet.MOVING_RIGHT) {
                this.player.setTexture(GPlayerSpritesheet.MOVING_RIGHT);
                this.player.play(GPlayerSpritesheet.MOVING_RIGHT);
            }

            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.controlsKeys.W.isDown) && this.player.body.blocked.down)
        {
            this.player.setVelocityY(-1000);
        }

        if (this.player.body.blocked.down) {
            if (this.player.anims.isPaused) {
                this.player.anims.resume();
            }
        } else {
            if (this.player.anims.isPlaying) {
                this.player.anims.pause(this.player.anims.currentAnim?.frames[this.utils.randomInt(0, 1) ? 4 : 0]);
            }
        }
    }

    public addBullets(amount: number) {
        this.cds.addBullets(amount);
        this.emit("player:bullets-amount-changed", this);
    }

    public override destroy(): void {
        this.player.destroy();
        this.playerAnimation.destroy();
        this.playerMovingLeftAnimation.destroy();
    }

    public static Create(scene: Phaser.Scene) {
        return new GPlayer(scene);
    }
}

export default GPlayer;