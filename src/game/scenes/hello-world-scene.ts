import Phaser from 'phaser'

import {
    GPlayer,
    GBeer,
    GBackground
} from "@/game/core/entities";

export default class HelloWorldScene extends Phaser.Scene {
    beer: GBeer;
    player: GPlayer;
    background: GBackground;

    beerPushedScore = 0;
    beerPushedScoreText?: Phaser.GameObjects.Text;

    constructor() {
        super('hello-world');

        this.background = new GBackground(this);
        this.beer = new GBeer(this);
        this.player = new GPlayer(this);
    }

    preload() {
        this.background.preload();
        this.beer.preload();
        this.player.preload();
    }

    create() {
        this.background.create();
        this.beer.create();
        this.player.create();

        this.physics.add.collider(this.player.getPhaserInstance(), this.beer.getPhaserInstance(), () => {
            this.beerPushedScore += 1;
            this.beerPushedScoreText?.setText(`You pushed the beer ${this.beerPushedScore} times`);
        });

        this.beerPushedScoreText = this.add.text(16, 16, "You pushed the beer 0 times", { fontSize: '32px', color: '#fff' });

        const escapeButton = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        escapeButton?.on("down", () => {
            this.game.isPaused ? this.game.resume() : this.game.pause();
        });
    }

    override update(time: number, delta: number) {
        super.update(time, delta);

        this.background.update(time, delta);
        this.beer.update(time, delta);
        this.player.update(time, delta);
    }
}
