import Phaser from "phaser";
import GEntity from "@/game/core/entities/entity";

class GBeer extends GEntity<Phaser.Types.Physics.Arcade.ImageWithDynamicBody> {
    protected beer!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public override getPhaserInstance(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
        return this.beer;
    }

    public override preload(): void {
        this.scene.load.image('beer', 'assets/img/beer.png');
    }

    public override create(): void {
        this.beer = this.scene.physics.add.image(400, 100, 'beer');

        this.beer.setScale(0.5, 0.5);

        this.beer.setVelocity(200, 200);
        this.beer.setBounce(1, 1);
        this.beer.body.setCollideWorldBounds(true);
    }

    public override update(time: number, delta: number): void {
        this.beer.setRotation(this.beer.rotation + 0.05);
    }

    public override destroy(): void {
        this.beer.destroy();
    }

    public static Create(scene: Phaser.Scene) {
        return new GBeer(scene);
    }
}

export default GBeer;