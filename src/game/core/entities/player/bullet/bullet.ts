import Phaser from "phaser";
import {GPlayerImages} from "@/game/core/entities/player/types";

class GBullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, GPlayerImages.CD);
    }

    public fire(x: number, y: number, velocity: number) {
        this.body?.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(velocity);
    }

    protected override preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.x > this.scene.game.canvas.width || this.x < 0) {
            this.setVisible(false);
            this.setActive(false);

            this.destroy();
        }
    }
}

export default GBullet;