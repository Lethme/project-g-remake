import GPlayer from "@/game/core/entities/player";
import {GPlayerSpritesheet} from "@/game/core/entities/player/types";
import Phaser from "phaser";

type HookReturnType = ReturnType<typeof usePlayerAnimations>;
export function usePlayerAnimations(scene: Phaser.Scene, callback?: (result: HookReturnType) => void) {
    const playerMovingRightAnimation = scene.anims.create({
        key: GPlayerSpritesheet.MOVING_RIGHT,
        frameRate: 60 / 8,
        frames: scene.anims.generateFrameNumbers(GPlayerSpritesheet.MOVING_RIGHT, {
            start: 0,
            end: 7,
        }),
        repeat: -1,
    }) as Phaser.Animations.Animation;

    const playerMovingLeftAnimation = scene.anims.create({
        key: GPlayerSpritesheet.MOVING_LEFT,
        frameRate: 60 / 8,
        frames: scene.anims.generateFrameNumbers(GPlayerSpritesheet.MOVING_LEFT, {
            start: 0,
            end: 7,
        }),
        repeat: -1,
    }) as Phaser.Animations.Animation;

    const result = {
        playerMovingRightAnimation,
        playerMovingLeftAnimation,
    };

    callback && callback.call(null, result);

    return result;
}