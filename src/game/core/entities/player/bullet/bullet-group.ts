import Phaser from "phaser";
import {GPlayerImages} from "@/game/core/entities/player/types";
import GBullet from "@/game/core/entities/player/bullet/bullet";

class GBulletGroup extends Phaser.Physics.Arcade.Group
{
    protected _bulletsAmount: number;

    public get bulletsAmount(): number { return this._bulletsAmount; }

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);
        this.addBullets(10);
        this._bulletsAmount = this.getLength();
    }

    fireCD(x: number, y: number, velocity: number) {
        const cd: GBullet = this.getFirstDead(false);

        if(cd) {
            cd.fire(x, y, velocity);
            this._bulletsAmount -= 1;
        }
    }

    addBullets(amount: number) {
        this.createMultiple({
            key: GPlayerImages.CD,
            frameQuantity: amount,
            active: false,
            visible: false,
            classType: GBullet,
        });

        this._bulletsAmount = this.getLength();
    }
}

export default GBulletGroup;