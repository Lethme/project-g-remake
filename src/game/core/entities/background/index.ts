import Phaser from "phaser";
import GEntity from "@/game/core/entities/entity";

class GBackground extends GEntity<Phaser.GameObjects.TileSprite> {
    protected background!: Phaser.GameObjects.TileSprite;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public override getPhaserInstance(): Phaser.GameObjects.TileSprite {
        return this.background;
    }

    public override preload(): void {
        this.scene.load.image('background', "assets/img/sprites/background.png");
    }

    public override create(): void {
        this.background = this.scene.add.tileSprite(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 0, 0, 'background');

        let scaleX = this.scene.cameras.main.width / this.background.width;
        let scaleY = this.scene.cameras.main.height / this.background.height;
        let scale = Math.max(scaleX, scaleY);
        this.background.setScale(scaleX, scaleY).setScrollFactor(0);

        this.background.tileScaleX = (this.background.width / this.scene.cameras.main.width) / (16 / 9);
    }

    public override update(time: number, delta: number): void {
        this.background.tilePositionX += 1;
    }

    public override destroy(): void {
        this.background.destroy();
    }

    public static Create(scene: Phaser.Scene) {
        return new GBackground(scene);
    }
}

export default GBackground;