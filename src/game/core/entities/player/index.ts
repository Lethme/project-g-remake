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

import {
    usePlayer,
    usePlayerAnimations,
} from "@/game/core/entities/player/hooks";

class GPlayer extends GEntity<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> {
    protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected playerMovingRightAnimation!: Phaser.Animations.Animation;
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
        usePlayer(this.scene, (result) => {
            this.playerMovingRightAnimation = result.animations.playerMovingRightAnimation;
            this.playerMovingLeftAnimation = result.animations.playerMovingLeftAnimation;

            this.player = result.player;

            this.cursors = result.controls.cursors;
            this.controlsKeys = result.controls.controlsKeys;
        });

        this.cds = new GBulletGroup(this.scene);

        this.controlsKeys.SPACE.on("down", () => {
            this.cds.fireCD(this.player.x, this.player.y, this.player.texture.key === GPlayerSpritesheet.MOVING_LEFT ? -1500 : 1500);
            this.emit("player:bullets-amount-changed", this);
        });
    }

    public override update(time: number, delta: number): void {
        this.updateControls(time, delta);
        this.updateJumpAnimation(time, delta);
    }

    private updateJumpAnimation(time: number, delta: number) {
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

    private updateControls(time: number, delta: number) {
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
    }

    public addBullets(amount: number) {
        this.cds.addBullets(amount);
        this.emit("player:bullets-amount-changed", this);
    }

    public override destroy(): void {
        this.player.destroy();
        this.playerMovingRightAnimation.destroy();
        this.playerMovingLeftAnimation.destroy();
        this.cds.destroy();
    }

    public static Create(scene: Phaser.Scene) {
        return new GPlayer(scene);
    }
}

export default GPlayer;