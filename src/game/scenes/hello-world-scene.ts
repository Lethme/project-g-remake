import Phaser from 'phaser'

import {
    GPlayer,
    GBeer,
    GBackground
} from "@/game/core/entities";

import GEntityManager from "@/game/core/entities/manager";
import {GPlayerImages} from "@/game/core/entities/player/types";
import {GBullet} from "@/game/core/entities/player/bullet";

enum SceneEntity {
    PLAYER = "player",
    BACKGROUND = 'background',
    BEER = 'beer',
}

export default class HelloWorldScene extends Phaser.Scene {
    entityManager: GEntityManager;

    beerPushedScore = 0;
    beerPushedScoreText!: Phaser.GameObjects.Text;

    cdsText?: Phaser.GameObjects.Text;

    constructor() {
        super('hello-world');

        this.entityManager = new GEntityManager([
            [ SceneEntity.BACKGROUND, new GBackground(this) ],
            [ SceneEntity.BEER, new GBeer(this) ],
            [ SceneEntity.PLAYER, new GPlayer(this) ],
        ]);
    }

    preload() {
        this.entityManager.preload();
    }

    create() {
        this.entityManager.create();

        this.physics.add.collider(
            this.entityManager.getEntityPhaserInstance<GPlayer>(SceneEntity.PLAYER)!,
            this.entityManager.getEntityPhaserInstance<GBeer>(SceneEntity.BEER)!,
            () => {
                this.beerPushedScore += 1;
                this.beerPushedScoreText.setText(`You pushed the beer ${this.beerPushedScore} times`);

                this.entityManager.getEntity<GPlayer>(SceneEntity.PLAYER)?.addBullets(1);
            }
        );

        this.physics.add.collider(
            this.entityManager.getEntityPhaserInstance<GBeer>(SceneEntity.BEER)!,
            this.entityManager.getEntity<GPlayer>(SceneEntity.PLAYER)!.bullets,
            (_, bullet: any) => {
                (bullet as GBullet).destroy();
            }
        )

        this.beerPushedScoreText = this.add.text(16, 16, "You pushed the beer 0 times", { fontSize: '32px', color: '#fff' });

        this.add.image(50, 70, GPlayerImages.CD);
        this.cdsText = this.add.text(90, 55, `:${this.entityManager.getEntity<GPlayer>(SceneEntity.PLAYER)?.bulletsAmount}`, { fontSize: '32px', color: '#fff' });

        this.entityManager.getEntity<GPlayer>(SceneEntity.PLAYER)?.on("player:bullets-amount-changed", (player: GPlayer) => {
            this.cdsText?.setText(`:${player.bulletsAmount}`);
        });

        const escapeButton = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        escapeButton?.on("down", () => {
            this.game.isPaused ? this.game.resume() : this.game.pause();
        });
    }

    override update(time: number, delta: number) {
        super.update(time, delta);

        this.entityManager.update(time, delta);
    }
}
